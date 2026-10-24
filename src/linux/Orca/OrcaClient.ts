import type {
  ActionOptions,
  GuidepupSpeechdMessage,
  OrcaService,
  QueueAction,
} from "./types";
import { type ChildProcess, execFileSync, spawn } from "node:child_process";
import { connect, type Socket } from "node:net";
import {
  DBusInterface,
  type MessageBus,
  sessionBus,
  UnknownInterfaceError,
} from "dbus-native";
import {
  ERR_ORCA_AT_SPI_LAUNCHER_MISSING,
  ERR_ORCA_AT_SPI_SERVICE_TIMEOUT,
  ERR_ORCA_CANNOT_BE_STARTED,
  ERR_ORCA_DBUS_CONNECTION_TIMEOUT,
  ERR_ORCA_DBUS_START_FAILURE,
  ERR_ORCA_NOT_RUNNING,
  ERR_ORCA_SERVICE_TIMEOUT,
  ERR_ORCA_SPEECH_DISPATCHER_SERVICE_TIMEOUT,
  ERR_ORCA_SPEECHD_CANNOT_CONNECT,
  ERR_ORCA_X_SERVER_TIMEOUT,
} from "../errors";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { base } from "../../debug";
import type { Capture } from "../../Capture";
import { cleanSpokenPhrase } from "./cleanSpokenPhrase";
import type { CommandOptions } from "../../CommandOptions";
import EventEmitter from "node:events";
import { findAvailableDisplay } from "./findAvailableDisplay";
import { getOrcaInstallationPath } from "./getOrcaInstallationPath";
import { isAtSpiRunning } from "./isAtSpiRunning";
import { isUnixSocket } from "./isUnixSocket";
import { join } from "node:path";
import { logProcessOutput } from "./logProcessOutput";
import { serviceDefinition } from "./serviceDefinition";
import { terminateProcess } from "./terminateProcess";
import { tmpdir } from "node:os";
import { waitForCondition } from "../../waitForCondition";

const debug = base.extend("OrcaClient");

interface AtSpiAccessibilityBus {
  GetAddress(): PromiseLike<string>;
}

interface AtSpiDeviceEventController {
  GenerateKeyboardEvent(
    keycode: number,
    keystring: string,
    synthType: number,
  ): PromiseLike<void>;
}

const POLL_INTERVAL = 500;
const MAX_POLL_TIMEOUT = 5_000;
const MAX_CONSECUTIVE_CONNECTION_FAILURES = 20;
const SPEECH_DEBOUNCE_TIMEOUT = 1_000;

const AT_SPI_DBUS_A11Y_WELL_KNOWN_SERVICE_NAME = "org.a11y.Bus";
const SESSION_DBUS_ORCA_WELL_KNOWN_SERVICE_NAME = "org.gnome.Orca1.Service";

const READY = "ready";
const CANCEL = "cancel";
const SPEECH = "speech";

const isUnknownOrcaInterfaceError = (cause: unknown): cause is Error =>
  cause instanceof UnknownInterfaceError;

export class OrcaClient extends EventEmitter {
  #xvfbDisplay = null;
  #xvfbProcess = null;

  #sessionDBusAddress: string = null;
  #sessionDBusProcess: ChildProcess = null;
  #sessionDBus: MessageBus = null;

  #atSpiProcess: ChildProcess = null;
  #atSpiBus: MessageBus = null;
  #atSpiDeviceEventController: AtSpiDeviceEventController = null;

  #runtimeDirectory: string = null;

  #speechdProcess: ChildProcess = null;
  #speechdAddress: string = null;
  #speechdSocketPath: string = null;
  #speechdSocket: Socket = null;
  #speechdConsecutiveConnectionFailures = 0;

  #orcaProcess: ChildProcess = null;
  #orcaDebugLogProcess: ChildProcess = null;
  #orcaService: OrcaService = null;

  #capture: CommandOptions["capture"] = null;
  #inFlight: Promise<unknown> | null = null;
  #queue: QueueAction[] = [];
  #spokenPhrases = [];

  #started = false;
  #starting = false;
  #stopping = false;

  /**
   * Get the log of all spoken phrases for this Orca connection.
   *
   * @returns {Promise<string[]>} All spoken phrases
   */
  async spokenPhraseLog(): Promise<string[]> {
    await this.#waitForAllActions();

    return this.#spokenPhrases;
  }

  /**
   * Clear the log of all spoken phrases for this Orca connection.
   */
  async clearSpokenPhraseLog(): Promise<void> {
    await this.#waitForAllActions();

    this.#spokenPhrases = [];
  }

  async #ensureXServer(): Promise<void> {
    debug("Ensuring X Server is running...");

    this.#xvfbDisplay = process.env.DISPLAY;

    if (!this.#xvfbDisplay) {
      this.#xvfbDisplay = findAvailableDisplay();

      debug(`Starting Xvfb on DISPLAY=${this.#xvfbDisplay}`);

      this.#xvfbProcess = spawn("Xvfb", [
        this.#xvfbDisplay,
        "-screen",
        "0",
        "1280x720x24",
      ]);

      logProcessOutput(this.#xvfbProcess, "xvfb");
    }

    debug(`DISPLAY=${this.#xvfbDisplay}`);

    await waitForCondition(
      () => {
        debug("Polling for X Server running");

        execFileSync("xdpyinfo", ["-display", this.#xvfbDisplay]);

        return true;
      },
      {
        pollInterval: POLL_INTERVAL,
        pollTimeout: MAX_POLL_TIMEOUT,
        timeoutErrorMessage: ERR_ORCA_X_SERVER_TIMEOUT,
      },
    );
  }

  async #ensureDBus(): Promise<void> {
    debug("Ensuring session D-Bus running...");

    this.#sessionDBusAddress = process.env.DBUS_SESSION_BUS_ADDRESS;

    if (!this.#sessionDBusAddress) {
      this.#sessionDBusProcess = spawn(
        "dbus-daemon",
        ["--session", "--nofork", "--print-address"],
        {
          env: {
            ...process.env,
            DISPLAY: this.#xvfbDisplay,
          },
        },
      );

      logProcessOutput(this.#sessionDBusProcess, "dbus");

      this.#sessionDBusAddress = await new Promise<string>((resolve) => {
        this.#sessionDBusProcess.stdout.once("data", (data: Buffer) => {
          resolve(data.toString().trim());
        });

        this.#sessionDBusProcess.once("error", () => resolve(""));
        this.#sessionDBusProcess.once("exit", () => resolve(""));
      });

      if (!this.#sessionDBusAddress) {
        throw new Error(ERR_ORCA_DBUS_START_FAILURE);
      }
    }

    debug(`DBUS_SESSION_BUS_ADDRESS=${this.#sessionDBusAddress}`);

    this.#sessionDBus = sessionBus({
      busAddress: this.#sessionDBusAddress,
    });

    await waitForCondition(
      async () => {
        debug("Polling for D-Bus connectivity");

        await this.#sessionDBus.listNames();

        return true;
      },
      {
        pollInterval: POLL_INTERVAL,
        pollTimeout: MAX_POLL_TIMEOUT,
        timeoutErrorMessage: ERR_ORCA_DBUS_CONNECTION_TIMEOUT,
      },
    );
  }

  async #ensureAtSpi(): Promise<void> {
    debug("Ensuring AT-SPI D-Bus running...");

    if (!isAtSpiRunning()) {
      debug("Starting AT-SPI D-Bus...");

      const atSpiLauncher = [
        "/usr/libexec/at-spi-bus-launcher",
        "/usr/lib/at-spi2-core/at-spi-bus-launcher",
      ].find((command) => existsSync(command));

      if (!atSpiLauncher) {
        throw new Error(ERR_ORCA_AT_SPI_LAUNCHER_MISSING);
      }

      // In its own process group, so that stop() also reaches the a11y bus
      // and at-spi2-registryd that the launcher starts, which outlive it.
      this.#atSpiProcess = spawn(atSpiLauncher, ["--launch-immediately"], {
        detached: true,
        env: {
          ...process.env,
          DBUS_SESSION_BUS_ADDRESS: this.#sessionDBusAddress,
          DISPLAY: this.#xvfbDisplay,
        },
      });

      logProcessOutput(this.#atSpiProcess, "at-spi");
    }

    await waitForCondition(
      async () => {
        debug(
          `Polling for '${AT_SPI_DBUS_A11Y_WELL_KNOWN_SERVICE_NAME}' name ownership`,
        );

        return await this.#sessionDBus.nameHasOwner(
          AT_SPI_DBUS_A11Y_WELL_KNOWN_SERVICE_NAME,
        );
      },
      {
        pollInterval: POLL_INTERVAL,
        pollTimeout: MAX_POLL_TIMEOUT,
        timeoutErrorMessage: ERR_ORCA_AT_SPI_SERVICE_TIMEOUT,
      },
    );
  }

  async #startSpeechd(): Promise<void> {
    debug("Starting Speech Dispatcher");

    const installationPath = getOrcaInstallationPath();
    const speechdDirectory = join(installationPath, "speechd");
    const speechdModulesDirectory = join(speechdDirectory, "modules");
    const speechdLogsDirectory = join(speechdDirectory, "logs");

    // Each session gets its own directory for its sockets. With shared paths,
    // a previous session's speech-dispatcher module could still be exiting
    // and remove the new session's socket. Keep it short: Unix socket paths
    // are limited to 108 bytes.
    const speechdSocketPath = join(this.#runtimeDirectory, "speechd.sock");

    mkdirSync(speechdLogsDirectory, { recursive: true });

    this.#speechdSocketPath = join(this.#runtimeDirectory, "guidepup.sock");

    const args = [
      "--run-single",
      "--config-dir",
      speechdDirectory,
      "--module-dir",
      speechdModulesDirectory,
      "--log-dir",
      speechdLogsDirectory,
      "--communication-method",
      "unix_socket",
      "--socket-path",
      speechdSocketPath,
      "--timeout",
      "0",
    ];

    if (debug.enabled) {
      args.push("--log-level", "5");
    }

    this.#speechdProcess = spawn("speech-dispatcher", args, {
      env: {
        ...process.env,
        GUIDEPUP_ORCA_SPEECH_SOCKET: this.#speechdSocketPath,
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    logProcessOutput(this.#speechdProcess, "speechd");

    this.#speechdAddress = `unix_socket:${speechdSocketPath}`;

    debug(`SPEECHD_ADDRESS=${this.#speechdAddress}`);

    await waitForCondition(
      () => {
        debug(`Polling for '${speechdSocketPath}' unix socket existence`);

        return isUnixSocket(speechdSocketPath);
      },
      {
        pollInterval: POLL_INTERVAL,
        pollTimeout: MAX_POLL_TIMEOUT,
        timeoutErrorMessage: ERR_ORCA_SPEECH_DISPATCHER_SERVICE_TIMEOUT,
      },
    );
  }

  #speechdDisconnect() {
    try {
      this.#speechdSocket?.destroy();
    } catch {
      // Swallow
    }

    this.#speechdSocket = null;
  }

  async #connectSpeechdSocket() {
    return await new Promise<void>((resolve, reject) =>
      this.#connectSpeechdSocketInner(resolve, reject),
    );
  }

  #connectSpeechdSocketInner(
    onSuccess: () => void,
    onError: (error: Error) => void,
  ): void {
    debug(`Connecting to Speech Dispatcher socket: ${this.#speechdSocketPath}`);

    let speechdSocketBuffer = "";
    let onSuccessCalled = false;

    const onReady = () => {
      this.#speechdConsecutiveConnectionFailures = 0;

      onSuccessCalled = true;
      onSuccess();
    };

    this.#speechdSocket = connect(this.#speechdSocketPath, () => {
      this.once(READY, onReady);
    });

    this.#speechdSocket.setEncoding("utf8");

    this.#speechdSocket.on("error", (cause) => {
      debug("Speech Dispatcher socket error", cause);

      this.off(READY, onReady);
      this.#speechdDisconnect();

      if (onSuccessCalled) {
        return;
      }

      this.#speechdConsecutiveConnectionFailures++;

      if (
        this.#speechdConsecutiveConnectionFailures <
        MAX_CONSECUTIVE_CONNECTION_FAILURES
      ) {
        setTimeout(() => {
          this.#connectSpeechdSocketInner(onSuccess, onError);
        }, POLL_INTERVAL);

        return;
      }

      onError(new Error(ERR_ORCA_SPEECHD_CANNOT_CONNECT, { cause }));
    });

    this.#speechdSocket.on("data", (data: string) => {
      speechdSocketBuffer += data;

      let newlineIndex: number;

      while ((newlineIndex = speechdSocketBuffer.indexOf("\n")) !== -1) {
        const line = speechdSocketBuffer.slice(0, newlineIndex);

        speechdSocketBuffer = speechdSocketBuffer.slice(newlineIndex + 1);

        if (!line.trim().length) {
          continue;
        }

        let message: GuidepupSpeechdMessage;

        try {
          message = JSON.parse(line);
        } catch {
          continue;
        }

        switch (message.type) {
          case "ready": {
            debug("ready");

            this.emit(READY);

            break;
          }
          case "speech": {
            const cleanedSpokenPhrase = cleanSpokenPhrase(message.data);

            debug("speech", cleanedSpokenPhrase);

            this.emit(SPEECH, cleanedSpokenPhrase);

            break;
          }
          case "stop":
          case "cancel": {
            debug("cancel");

            this.emit(CANCEL);

            break;
          }
        }
      }
    });
  }

  async #startOrca(): Promise<void> {
    debug("Starting Orca");

    const installationPath = getOrcaInstallationPath();
    const orcaExecutable = join(installationPath, "bin", "orca");
    const args = ["--profile", "guidepup", "--replace"];

    if (debug.enabled) {
      const orcaDebugLogPath = join(this.#runtimeDirectory, "orca-debug.log");

      writeFileSync(orcaDebugLogPath, "");
      args.push("--debug", `--debug-file=${orcaDebugLogPath}`);

      this.#orcaDebugLogProcess = spawn("tail", ["-f", orcaDebugLogPath], {
        stdio: ["ignore", "inherit", "pipe"],
      });

      logProcessOutput(this.#orcaDebugLogProcess, "orca-debug-log");
    }

    this.#orcaProcess = spawn(orcaExecutable, args, {
      env: {
        ...process.env,
        DBUS_SESSION_BUS_ADDRESS: this.#sessionDBusAddress,
        DISPLAY: this.#xvfbDisplay,
        SPEECHD_ADDRESS: this.#speechdAddress,
      },
    });

    logProcessOutput(this.#orcaProcess, "orca");

    await waitForCondition(
      async () => {
        debug(
          `Polling for '${SESSION_DBUS_ORCA_WELL_KNOWN_SERVICE_NAME}' name ownership`,
        );

        return await this.#sessionDBus.nameHasOwner(
          SESSION_DBUS_ORCA_WELL_KNOWN_SERVICE_NAME,
        );
      },
      {
        pollInterval: POLL_INTERVAL,
        pollTimeout: MAX_POLL_TIMEOUT,
        timeoutErrorMessage: ERR_ORCA_SERVICE_TIMEOUT,
      },
    );
  }

  async #mapOrcaDBusService(): Promise<void> {
    debug("Connecting to Orca D-Bus service...");

    const sessionDBusOrcaService = this.#sessionDBus.getService(
      SESSION_DBUS_ORCA_WELL_KNOWN_SERVICE_NAME,
    );

    const mapModule = async <K extends keyof typeof serviceDefinition.modules>(
      name: K,
    ): Promise<OrcaService[K] | undefined> => {
      const moduleDefinition = serviceDefinition.modules[name];

      const interfaceName = `org.gnome.Orca1.${name}`;
      const startTime = Date.now();
      let dbusInterface: DBusInterface | undefined;

      while (!dbusInterface) {
        try {
          dbusInterface = await sessionDBusOrcaService.getInterface(
            moduleDefinition.objectPath,
            interfaceName,
          );
        } catch (cause) {
          if (!isUnknownOrcaInterfaceError(cause)) {
            throw cause;
          }

          if (Date.now() - startTime >= MAX_POLL_TIMEOUT) {
            if (name === "MousePresenter") {
              debug(
                `Optional Orca interface '${interfaceName}' is unavailable.`,
              );

              return undefined;
            }

            throw new Error(
              `Timed out waiting for Orca D-Bus interface '${interfaceName}'.`,
              { cause },
            );
          }

          await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        }
      }

      return {
        commands: Object.fromEntries(
          Object.keys(moduleDefinition.commands).map((key) => [
            key,
            {
              ...moduleDefinition.commands[key],
              execute: (notifyUser: boolean = true) =>
                dbusInterface[key](notifyUser),
            },
          ]),
        ),
        parameterizedCommands: Object.fromEntries(
          Object.keys(moduleDefinition.parameterizedCommands ?? {}).map(
            (key) => [
              key,
              {
                ...moduleDefinition.parameterizedCommands[key],
                execute: (...parameters: unknown[]) =>
                  dbusInterface[key](...parameters),
              },
            ],
          ),
        ),
        runtimeGetters: Object.fromEntries(
          Object.keys(moduleDefinition.runtimeGetters ?? {}).map((key) => [
            key,
            {
              ...moduleDefinition.runtimeGetters[key],
              get: () => dbusInterface.$readProp(key),
            },
          ]),
        ),
        runtimeSetters: Object.fromEntries(
          Object.keys(moduleDefinition.runtimeSetters ?? {}).map((key) => [
            key,
            {
              ...moduleDefinition.runtimeSetters[key],
              set: (value: unknown) => dbusInterface.$writeProp(key, value),
            },
          ]),
        ),
      } as OrcaService[K];
    };

    const entries = await Promise.all(
      (
        Object.keys(serviceDefinition.modules) as Array<
          keyof typeof serviceDefinition.modules
        >
      ).map(async (name) => [name, await mapModule(name)] as const),
    );

    this.#orcaService = Object.fromEntries(entries) as OrcaService;

    debug(
      `Ready: Successfully mapped interface ${SESSION_DBUS_ORCA_WELL_KNOWN_SERVICE_NAME}.`,
    );
  }

  /**
   * Connect to the AT-SPI device event controller, which generates real
   * keyboard input (XTest under X11) that Orca hears like a person's keyboard.
   */
  async #connectAtSpiDeviceEventController(): Promise<void> {
    debug("Connecting to AT-SPI device event controller...");

    const a11yBus = await this.#sessionDBus
      .getService(AT_SPI_DBUS_A11Y_WELL_KNOWN_SERVICE_NAME)
      .getInterface<AtSpiAccessibilityBus>(
        "/org/a11y/bus",
        AT_SPI_DBUS_A11Y_WELL_KNOWN_SERVICE_NAME,
      );

    const address: string = await a11yBus.GetAddress();

    debug(`AT_SPI_BUS_ADDRESS=${address}`);

    this.#atSpiBus = sessionBus({ busAddress: address });
    this.#atSpiDeviceEventController = await this.#atSpiBus
      .getService("org.a11y.atspi.Registry")
      .getInterface<AtSpiDeviceEventController>(
        "/org/a11y/atspi/registry/deviceeventcontroller",
        "org.a11y.atspi.DeviceEventController",
      );
  }

  /**
   * Generate a real keyboard event.
   *
   * @param {number} keycode Keycode, keysym or modifier mask, depending on the synth type.
   * @param {string} keystring Text to type for the string synth type, otherwise empty.
   * @param {number} synthType An AT-SPI `KeySynthType`.
   */
  async generateKeyboardEvent(
    keycode: number,
    keystring: string,
    synthType: number,
  ): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#atSpiDeviceEventController.GenerateKeyboardEvent(
      keycode,
      keystring,
      synthType,
    );
  }

  async start(options?: Pick<CommandOptions, "capture">) {
    if (this.#started || this.#starting) {
      return;
    }

    this.#starting = true;
    this.#capture = options?.capture;

    try {
      this.#runtimeDirectory = mkdtempSync(join(tmpdir(), "guidepup-orca-"));

      await this.#ensureXServer();
      await this.#ensureDBus();
      await this.#ensureAtSpi();
      await this.#connectAtSpiDeviceEventController();
      await this.#startSpeechd();
      await this.#connectSpeechdSocket();
      await this.#startOrca();
      await this.#mapOrcaDBusService();

      await this.#orcaService.SpeechPresenter.commands.ToggleMonitor.execute(
        false,
      );

      this.#started = true;
    } catch (cause) {
      throw new Error(ERR_ORCA_CANNOT_BE_STARTED, { cause });
    } finally {
      if (!this.#started) {
        await this.stop();
      }

      this.#starting = false;
    }
  }

  async stop() {
    debug("stopping");

    this.#stopping = true;

    await this.#waitForAllActions();

    this.#speechdDisconnect();

    // One at a time, waiting for each to exit, so that Orca can shut down
    // cleanly while the services it depends on are still running.
    await terminateProcess(this.#orcaProcess, "Orca");
    await terminateProcess(this.#orcaDebugLogProcess, "Orca debug log");
    await terminateProcess(this.#speechdProcess, "Speech Dispatcher");
    if (this.#atSpiProcess?.pid) {
      try {
        process.kill(-this.#atSpiProcess.pid, "SIGTERM");
      } catch {
        // Already gone.
      }
    }
    await terminateProcess(this.#atSpiProcess, "AT-SPI");
    await terminateProcess(this.#sessionDBusProcess, "session D-Bus");
    await terminateProcess(this.#xvfbProcess, "X Server");

    if (this.#runtimeDirectory) {
      rmSync(this.#runtimeDirectory, { force: true, recursive: true });
    }

    this.#xvfbDisplay = null;
    this.#xvfbProcess = null;

    await this.#atSpiBus?.close();
    await this.#sessionDBus?.close();

    this.#atSpiBus = null;
    this.#atSpiDeviceEventController = null;

    this.#sessionDBusAddress = null;
    this.#sessionDBusProcess = null;
    this.#sessionDBus = null;

    this.#atSpiProcess = null;

    this.#speechdProcess = null;
    this.#speechdAddress = null;
    this.#speechdSocketPath = null;
    this.#runtimeDirectory = null;
    this.#speechdSocket = null;
    this.#speechdConsecutiveConnectionFailures = 0;

    this.#orcaProcess = null;
    this.#orcaDebugLogProcess = null;
    this.#orcaService = null;

    this.#capture = null;
    this.#inFlight = null;
    this.#queue = [];

    this.#stopping = false;
    this.#started = false;
  }

  get service(): OrcaService {
    if (!this.#started || this.#stopping || !this.#orcaService) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    return this.#orcaService;
  }

  /**
   * Executes the provided action and waits
   * for the associated spoken phrase. Actions are executed serially in the
   * order they are enqueued.
   *
   * @param {() => Promise<T>} action Underlying action to capture logs for.
   * @param {object} options Additional options.
   * @returns {Promise<T>} Promise that resolves with the action's result.
   */
  enqueueAndTap<T>(
    action: () => Promise<T>,
    options?: ActionOptions,
  ): Promise<Capture<T>> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    debug("enqueuing action");

    let resolve, reject;

    const promise = new Promise<Capture<T>>((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });

    this.#queue.push({ action, options, promise, resolve, reject });
    this.#processQueue();

    return promise;
  }

  async #processQueue() {
    if (this.#inFlight || this.#queue.length === 0) {
      return;
    }

    debug("processing next queued action");

    const { action, options, resolve, reject, promise } = this.#queue.shift()!;
    this.#inFlight = promise;

    try {
      if (!this.#started || this.#stopping) {
        throw new Error(ERR_ORCA_NOT_RUNNING);
      }

      const spokenPhrases: string[] = [];
      let result: unknown;

      debug(`capture=${options?.capture ?? this.#capture}`);

      if (options?.capture ?? this.#capture) {
        // TODO: execute a "stop reading" like command

        let speechPromiseResolver: () => void;

        const speechPromise = new Promise<void>((resolve) => {
          speechPromiseResolver = resolve;
        });

        let timeoutId: NodeJS.Timeout = null;

        const speechHandler = (spokenPhrase: string) => {
          spokenPhrases.push(spokenPhrase);

          if ((options?.capture ?? this.#capture) === "initial") {
            clearTimeout(timeoutId);
            this.removeListener(SPEECH, speechHandler);
            speechPromiseResolver();
          } else if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(timeoutHandler, SPEECH_DEBOUNCE_TIMEOUT);
          }
        };

        const timeoutHandler = () => {
          this.removeListener(SPEECH, speechHandler);
          speechPromiseResolver();
        };

        this.addListener(SPEECH, speechHandler);

        debug("executing action");
        result = await action();
        debug("action completed");

        timeoutId = setTimeout(timeoutHandler, SPEECH_DEBOUNCE_TIMEOUT);

        await speechPromise;

        timeoutId = null;
      } else {
        result = await action();
      }

      const spokenPhrase = spokenPhrases.join(". ");
      this.#spokenPhrases.push(spokenPhrase);

      debug({ spokenPhrase });

      resolve({
        itemText: spokenPhrase,
        result,
        spokenPhrase,
      });
    } catch (error) {
      reject(error);
    } finally {
      this.#inFlight = null;
      this.#processQueue();
    }
  }

  async #waitForAllActions(): Promise<void> {
    const allPromises = this.#queue.map(({ promise }) => promise);

    if (this.#inFlight) {
      allPromises.push(this.#inFlight);
    }

    await Promise.allSettled(allPromises);
  }
}
