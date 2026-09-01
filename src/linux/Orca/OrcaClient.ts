import type {
  ActionOptions,
  GuidepupSpeechdMessage,
  OrcaService,
  QueueAction,
} from "./types";
import { type ChildProcess, execFileSync, spawn } from "node:child_process";
import { connect, type Socket } from "node:net";
import { dirname, join } from "node:path";
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
import { existsSync, mkdirSync } from "node:fs";
import { type MessageBus, sessionBus } from "dbus-native";
import { base } from "../../debug";
import type { Capture } from "../../Capture";
import type { CommandOptions } from "../../CommandOptions";
import EventEmitter from "node:events";
import { findAvailableDisplay } from "./findAvailableDisplay";
import { getOrcaInstallationPath } from "./getOrcaInstallationPath";
import { isAtSpiRunning } from "./isAtSpiRunning";
import { isUnixSocket } from "./isUnixSocket";
import { serviceDefinition } from "./serviceDefinition";

const debug = base.extend("OrcaClient");

const POLL_INTERVAL = 500;
const MAX_POLL_TIMEOUT = 5_000;
const MAX_CONSECUTIVE_CONNECTION_FAILURES = 20;
const SPEECH_DEBOUNCE_TIMEOUT = 1000;

const AT_SPI_DBUS_A11Y_WELL_KNOWN_SERVICE_NAME = "org.a11y.Bus";
const SESSION_DBUS_ORCA_WELL_KNOWN_SERVICE_NAME = "org.gnome.Orca.Service";

const READY = "ready";
const CANCEL = "cancel";
const SPEECH = "speech";

export class OrcaClient extends EventEmitter {
  #xvfbDisplay = null;
  #xvfbProcess = null;

  #sessionDBusAddress: string = null;
  #sessionDBusProcess: ChildProcess = null;
  #sessionDBus: MessageBus = null;

  #atSpiProcess: ChildProcess = null;

  #speechdProcess: ChildProcess = null;
  #speechdAddress: string = null;
  #speechdSocketPath: string = null;
  #speechdSocket: Socket = null;
  #speechdConsecutiveConnectionFailures = 0;

  #orcaProcess: ChildProcess = null;
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

      this.#xvfbProcess.stdout.on("data", (data: Buffer) => {
        debug(`[xvfb] ${data.toString().trimEnd()}`);
      });

      this.#xvfbProcess.stderr.on("data", (data: Buffer) => {
        debug(`[xvfb] ${data.toString().trimEnd()}`);
      });

      this.#xvfbProcess.on("error", (error) => {
        debug(`[xvfb] process error: ${error.message}`);
      });

      this.#xvfbProcess.on("exit", (code, signal) => {
        debug(`[xvfb] exited with code=${code}, signal=${signal}`);
      });
    }

    debug(`DISPLAY=${this.#xvfbDisplay}`);

    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const poll = async () => {
        if (Date.now() - startTime >= MAX_POLL_TIMEOUT) {
          reject(new Error(ERR_ORCA_X_SERVER_TIMEOUT));

          return;
        }

        debug("Polling for X Server running");

        try {
          execFileSync("xdpyinfo", ["-display", this.#xvfbDisplay]);
          resolve();

          return;
        } catch {
          // Swallow
        }

        setTimeout(poll, POLL_INTERVAL);
      };

      poll();
    });
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

      this.#sessionDBusProcess.stdout.on("data", (data: Buffer) => {
        debug(`[dbus] ${data.toString().trimEnd()}`);
      });

      this.#sessionDBusProcess.stderr.on("data", (data: Buffer) => {
        debug(`[dbus] ${data.toString().trimEnd()}`);
      });

      this.#sessionDBusProcess.on("error", (error) => {
        debug(`[dbus] process error: ${error.message}`);
      });

      this.#sessionDBusProcess.on("exit", (code, signal) => {
        debug(`[dbus] exited with code=${code}, signal=${signal}`);
      });

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

    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const poll = async () => {
        if (Date.now() - startTime >= MAX_POLL_TIMEOUT) {
          reject(new Error(ERR_ORCA_DBUS_CONNECTION_TIMEOUT));

          return;
        }

        debug("Polling for D-Bus connectivity");

        try {
          await this.#sessionDBus.listNames();

          resolve();

          return;
        } catch {
          // Swallow
        }

        setTimeout(poll, POLL_INTERVAL);
      };

      poll();
    });
  }

  #ensureAtSpi() {
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

      this.#atSpiProcess = spawn(atSpiLauncher, ["--launch-immediately"], {
        env: {
          ...process.env,
          DBUS_SESSION_BUS_ADDRESS: this.#sessionDBusAddress,
          DISPLAY: this.#xvfbDisplay,
        },
      });

      this.#atSpiProcess.stdout.on("data", (data: Buffer) => {
        debug(`[at-spi] ${data.toString().trimEnd()}`);
      });

      this.#atSpiProcess.stderr.on("data", (data: Buffer) => {
        debug(`[at-spi] ${data.toString().trimEnd()}`);
      });

      this.#atSpiProcess.on("error", (error) => {
        debug(`[at-spi] process error: ${error.message}`);
      });

      this.#atSpiProcess.on("exit", (code, signal) => {
        debug(`[at-spi] exited with code=${code}, signal=${signal}`);
      });
    }

    const startTime = Date.now();

    return new Promise<void>((resolve, reject) => {
      const poll = async () => {
        if (Date.now() - startTime >= MAX_POLL_TIMEOUT) {
          reject(new Error(ERR_ORCA_AT_SPI_SERVICE_TIMEOUT));

          return;
        }

        try {
          debug(
            `Polling for '${AT_SPI_DBUS_A11Y_WELL_KNOWN_SERVICE_NAME}' name ownership`,
          );

          const hasOwner = await this.#sessionDBus.nameHasOwner(
            AT_SPI_DBUS_A11Y_WELL_KNOWN_SERVICE_NAME,
          );

          if (hasOwner) {
            resolve();

            return;
          }
        } catch {
          // Swallow
        }

        setTimeout(poll, POLL_INTERVAL);
      };

      poll();
    });
  }

  #startSpeechd() {
    debug("Starting Speech Dispatcher");

    const installationPath = getOrcaInstallationPath();
    const speechdDirectory = join(installationPath, "speechd");
    const speechdModulesDirectory = join(speechdDirectory, "modules");
    const speechdLogsDirectory = join(speechdDirectory, "logs");
    const speechdSocketPath = join(speechdDirectory, "run", "speechd.sock");

    mkdirSync(speechdLogsDirectory, { recursive: true });
    mkdirSync(dirname(speechdSocketPath), { recursive: true });

    this.#speechdSocketPath = join(speechdDirectory, "out", "guidepup.sock");

    this.#speechdProcess = spawn(
      "speech-dispatcher",
      [
        "--run-single",
        "--config-dir",
        speechdDirectory,
        "--module-dir",
        speechdModulesDirectory,
        "--log-level",
        "5",
        "--log-dir",
        speechdLogsDirectory,
        "--communication-method",
        "unix_socket",
        "--socket-path",
        speechdSocketPath,
        "--timeout",
        "0",
      ],
      {
        env: {
          ...process.env,
          GUIDEPUP_ORCA_SPEECH_SOCKET: this.#speechdSocketPath,
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    this.#speechdProcess.stdout.on("data", (data: Buffer) => {
      debug(`[speechd] ${data.toString().trimEnd()}`);
    });

    this.#speechdProcess.stderr.on("data", (data: Buffer) => {
      debug(`[speechd] ${data.toString().trimEnd()}`);
    });

    this.#speechdProcess.on("error", (error) => {
      debug(`[speechd] process error: ${error.message}`);
    });

    this.#speechdProcess.on("exit", (code, signal) => {
      debug(`[speechd] exited with code=${code}, signal=${signal}`);
    });

    this.#speechdAddress = `unix_socket:${speechdSocketPath}`;

    debug(`SPEECHD_ADDRESS=${this.#speechdAddress}`);

    const startTime = Date.now();

    return new Promise<void>((resolve, reject) => {
      const poll = () => {
        if (Date.now() - startTime >= MAX_POLL_TIMEOUT) {
          reject(new Error(ERR_ORCA_SPEECH_DISPATCHER_SERVICE_TIMEOUT));

          return;
        }

        try {
          debug(`Polling for '${speechdSocketPath}' unix socket existence`);

          if (isUnixSocket(speechdSocketPath)) {
            resolve();

            return;
          }
        } catch {
          // Swallow
        }

        setTimeout(poll, POLL_INTERVAL);
      };

      poll();
    });
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
        this.#connectSpeechdSocketInner(onSuccess, onError);

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
            debug("speech", message);
            // TODO: parse the data to strip XML
            this.emit(SPEECH, message.data);

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

  #startOrca() {
    debug("Starting Orca");

    const installationPath = getOrcaInstallationPath();
    const orcaExecutable = join(installationPath, "bin", "orca");

    this.#orcaProcess = spawn(
      orcaExecutable,
      ["--profile", "guidepup", "--replace"],
      {
        env: {
          ...process.env,
          DBUS_SESSION_BUS_ADDRESS: this.#sessionDBusAddress,
          DISPLAY: this.#xvfbDisplay,
          SPEECHD_ADDRESS: this.#speechdAddress,
        },
      },
    );

    this.#orcaProcess.stdout.on("data", (data: Buffer) => {
      debug(`[orca] ${data.toString().trimEnd()}`);
    });

    this.#orcaProcess.stderr.on("data", (data: Buffer) => {
      debug(`[orca] ${data.toString().trimEnd()}`);
    });

    this.#orcaProcess.on("error", (error) => {
      debug(`[orca] process error: ${error.message}`);
    });

    this.#orcaProcess.on("exit", (code, signal) => {
      debug(`[orca] exited with code=${code}, signal=${signal}`);
    });

    const startTime = Date.now();

    return new Promise<void>((resolve, reject) => {
      const poll = async () => {
        if (Date.now() - startTime >= MAX_POLL_TIMEOUT) {
          reject(new Error(ERR_ORCA_SERVICE_TIMEOUT));

          return;
        }

        try {
          debug(
            `Polling for '${SESSION_DBUS_ORCA_WELL_KNOWN_SERVICE_NAME}' name ownership`,
          );

          const hasOwner = await this.#sessionDBus.nameHasOwner(
            SESSION_DBUS_ORCA_WELL_KNOWN_SERVICE_NAME,
          );

          if (hasOwner) {
            resolve();

            return;
          }
        } catch {
          // Swallow
        }

        setTimeout(poll, POLL_INTERVAL);
      };

      poll();
    });
  }

  async #mapOrcaDBusService(): Promise<void> {
    debug("Connecting to Orca D-Bus service...");

    const sessionDBusOrcaService = this.#sessionDBus.getService(
      SESSION_DBUS_ORCA_WELL_KNOWN_SERVICE_NAME,
    );

    const mapModule = async <K extends keyof typeof serviceDefinition.modules>(
      name: K,
    ): Promise<OrcaService[K]> => {
      const moduleDefinition = serviceDefinition.modules[name];

      const dbusInterface = await sessionDBusOrcaService.getInterface(
        moduleDefinition.objectPath,
        "org.gnome.Orca.Module",
      );

      return {
        commands: Object.fromEntries(
          Object.keys(moduleDefinition.commands).map((key) => [
            key,
            {
              ...moduleDefinition.commands[key],
              execute: (notifyUser: boolean = true) =>
                dbusInterface.ExecuteCommand(key, notifyUser),
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
                  dbusInterface.ExecuteParameterizedCommand(key, parameters),
              },
            ],
          ),
        ),
        runtimeGetters: Object.fromEntries(
          Object.keys(moduleDefinition.runtimeGetters ?? {}).map((key) => [
            key,
            {
              ...moduleDefinition.runtimeGetters[key],
              get: () => dbusInterface.ExecuteRuntimeGetter(key),
            },
          ]),
        ),
        runtimeSetters: Object.fromEntries(
          Object.keys(moduleDefinition.runtimeSetters ?? {}).map((key) => [
            key,
            {
              ...moduleDefinition.runtimeSetters[key],
              set: (value: unknown) =>
                dbusInterface.ExecuteRuntimeSetter(key, value),
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

  async start() {
    if (this.#started || this.#starting) {
      return;
    }

    this.#starting = true;

    try {
      await this.#ensureXServer();
      await this.#ensureDBus();
      await this.#ensureAtSpi();
      await this.#startSpeechd();
      await this.#connectSpeechdSocket();
      await this.#startOrca();
      await this.#mapOrcaDBusService();

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

    if (this.#orcaProcess && this.#orcaProcess.exitCode === null) {
      debug("Terminating Orca process...");

      this.#orcaProcess.kill("SIGTERM");
    }

    if (this.#speechdProcess && this.#speechdProcess.exitCode === null) {
      debug("Terminating Speech Dispatcher process...");

      this.#speechdProcess.kill("SIGTERM");
    }

    if (this.#atSpiProcess && this.#atSpiProcess.exitCode === null) {
      debug("Terminating AT-SPI process...");

      this.#atSpiProcess.kill("SIGTERM");
    }

    if (
      this.#sessionDBusProcess &&
      this.#sessionDBusProcess.exitCode === null
    ) {
      debug("Terminating session D-Bus process...");

      this.#sessionDBusProcess.kill("SIGTERM");
    }

    if (this.#xvfbProcess && this.#xvfbProcess.exitCode === null) {
      debug("Terminating X Server process...");

      this.#xvfbProcess.kill("SIGTERM");
    }

    this.#xvfbDisplay = null;
    this.#xvfbProcess = null;

    this.#sessionDBusAddress = null;
    this.#sessionDBusProcess = null;
    this.#sessionDBus = null;

    this.#atSpiProcess = null;

    this.#speechdProcess = null;
    this.#speechdAddress = null;
    this.#speechdSocketPath = null;
    this.#speechdSocket = null;
    this.#speechdConsecutiveConnectionFailures = 0;

    this.#orcaProcess = null;
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

      if (options?.capture ?? this.#capture) {
        // TODO: execute a "stop reading" like command

        let speechPromiseResolver: () => void;

        const speechPromise = new Promise<void>((resolve) => {
          speechPromiseResolver = resolve;
        });

        let timeoutId: NodeJS.Timeout = null;

        const speechHandler = (spokenPhrase: string) => {
          debug(`CAPTURE HANDLER received: "${spokenPhrase}"`);

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
