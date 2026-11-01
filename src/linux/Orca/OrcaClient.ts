import type {
  ActionOptions,
  GuidepupSpeechdMessage,
  OrcaService,
  QueueAction,
} from "./types";
import {
  type AtSpiDeviceEventControllerConnection,
  connectAtSpiDeviceEventController,
} from "./connectAtSpiDeviceEventController";
import { connect, type Socket } from "node:net";
import { DBusInterface, UnknownInterfaceError } from "dbus-native";
import {
  ERR_ORCA_CANNOT_BE_STARTED,
  ERR_ORCA_NOT_RUNNING,
  ERR_ORCA_SPEECHD_CANNOT_CONNECT,
} from "../errors";
import { mkdtempSync, rmSync } from "node:fs";
import { type OrcaProcesses, startOrca } from "./startOrca";
import { type SessionDBus, startSessionDBus } from "./startSessionDBus";
import {
  type SpeechDispatcher,
  startSpeechDispatcher,
} from "./startSpeechDispatcher";
import { startXServer, type XServer } from "./startXServer";
import { base } from "../../debug";
import type { Capture } from "../../Capture";
import type { ChildProcess } from "node:child_process";
import { cleanSpokenPhrase } from "./cleanSpokenPhrase";
import type { CommandOptions } from "../../CommandOptions";
import EventEmitter from "node:events";
import { join } from "node:path";
import { serviceDefinition } from "./serviceDefinition";
import { SESSION_DBUS_ORCA_WELL_KNOWN_SERVICE_NAME } from "./constants";
import { startAtSpi } from "./startAtSpi";
import { terminateAtSpi } from "./terminateAtSpi";
import { terminateProcess } from "./terminateProcess";
import { tmpdir } from "node:os";

const debug = base.extend("OrcaClient");

const POLL_INTERVAL = 500;
const MAX_POLL_TIMEOUT = 5_000;
const MAX_CONSECUTIVE_CONNECTION_FAILURES = 20;
const SPEECH_DEBOUNCE_TIMEOUT = 1_000;

const READY = "ready";
const CANCEL = "cancel";
const SPEECH = "speech";

const isUnknownOrcaInterfaceError = (cause: unknown): cause is Error =>
  cause instanceof UnknownInterfaceError;

export class OrcaClient extends EventEmitter {
  #xServer: XServer = null;

  #sessionDBus: SessionDBus = null;

  #atSpiProcess: ChildProcess = null;
  #atSpiDeviceEventController: AtSpiDeviceEventControllerConnection = null;

  #runtimeDirectory: string = null;

  #speechDispatcher: SpeechDispatcher = null;
  #speechdSocket: Socket = null;
  #speechdConsecutiveConnectionFailures = 0;

  #orca: OrcaProcesses = null;
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
    debug(
      `Connecting to Speech Dispatcher socket: ${this.#speechDispatcher.guidepupSocketPath}`,
    );

    let speechdSocketBuffer = "";
    let onSuccessCalled = false;

    const onReady = () => {
      this.#speechdConsecutiveConnectionFailures = 0;

      onSuccessCalled = true;
      onSuccess();
    };

    this.#speechdSocket = connect(
      this.#speechDispatcher.guidepupSocketPath,
      () => {
        this.once(READY, onReady);
      },
    );

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

  async #mapOrcaDBusService(): Promise<void> {
    debug("Connecting to Orca D-Bus service...");

    const sessionDBusOrcaService = this.#sessionDBus.bus.getService(
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

    await this.#atSpiDeviceEventController.controller.GenerateKeyboardEvent(
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

      this.#xServer = await startXServer();
      this.#sessionDBus = await startSessionDBus(this.#xServer.display);
      this.#atSpiProcess = await startAtSpi(
        this.#xServer.display,
        this.#sessionDBus,
      );
      this.#atSpiDeviceEventController =
        await connectAtSpiDeviceEventController(this.#sessionDBus.bus);
      this.#speechDispatcher = await startSpeechDispatcher(
        this.#runtimeDirectory,
      );
      await this.#connectSpeechdSocket();
      this.#orca = await startOrca({
        display: this.#xServer.display,
        runtimeDirectory: this.#runtimeDirectory,
        sessionDBus: this.#sessionDBus,
        speechdAddress: this.#speechDispatcher.address,
      });
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
    await terminateProcess(this.#orca?.process, "Orca");
    await terminateProcess(this.#orca?.debugLogProcess, "Orca debug log");
    await terminateProcess(
      this.#speechDispatcher?.process,
      "Speech Dispatcher",
    );
    await terminateAtSpi(this.#atSpiProcess);
    await terminateProcess(this.#sessionDBus?.process, "session D-Bus");
    await terminateProcess(this.#xServer?.process, "X Server");

    if (this.#runtimeDirectory) {
      rmSync(this.#runtimeDirectory, { force: true, recursive: true });
    }

    this.#xServer = null;

    await this.#atSpiDeviceEventController?.bus.close();
    await this.#sessionDBus?.bus.close();

    this.#atSpiDeviceEventController = null;

    this.#sessionDBus = null;

    this.#atSpiProcess = null;

    this.#speechDispatcher = null;
    this.#runtimeDirectory = null;
    this.#speechdSocket = null;
    this.#speechdConsecutiveConnectionFailures = 0;

    this.#orca = null;
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
