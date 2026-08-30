import { ChildProcess, spawn } from "node:child_process";
import { type DBusPromise, type MessageBus, sessionBus } from "dbus-native";
import {
  ERR_ORCA_AT_SPI_SERVICE_TIMEOUT,
  ERR_ORCA_CANNOT_BE_STARTED,
  ERR_ORCA_DBUS_ADDRESS_NOT_SET,
  ERR_ORCA_DBUS_CONNECTION_TIMEOUT,
  ERR_ORCA_NOT_RUNNING,
  ERR_ORCA_SERVICE_TIMEOUT,
  ERR_ORCA_SPEECH_DISPATCHER_SERVICE_TIMEOUT,
  ERR_ORCA_X_SERVER_DISPLAY_NOT_SET,
} from "../errors";
import { base } from "../../debug";
import type { Capture } from "../../Capture";
import type { CommandOptions } from "../../CommandOptions";
import { serviceDefinition } from "./serviceDefinition";
import { statSync } from "node:fs";

const debug = base.extend("OrcaClient");

const POLL_INTERVAL = 500;
const MAX_POLL_TIMEOUT = 5_000;

const AT_SPI_DBUS_A11Y_WELL_KNOWN_SERVICE_NAME = "org.a11y.Bus";
const SESSION_DBUS_ORCA_WELL_KNOWN_SERVICE_NAME = "org.gnome.Orca.Service";

// TODO: move to the Guidepup cache directory
const SPEECHD_DIR = "/tmp/guidepup-speechd";

type OrcaTypeMap = {
  str: string;
  bool: boolean;
};

type ParameterValue<P> = P extends { type: infer T extends keyof OrcaTypeMap }
  ? OrcaTypeMap[T]
  : never;

type ParameterTuple<P extends readonly { type: keyof OrcaTypeMap }[]> = {
  [K in keyof P]: ParameterValue<P[K]>;
};

type DBusCommand<
  Definition extends {
    description: string;
    representation?: string;
  },
> = Definition & {
  execute(notifyUser?: boolean): DBusPromise<void>;
};

type DBusParameterizedCommand<
  Definition extends {
    description: string;
    representation?: string;
  },
  Parameters extends readonly { type: keyof OrcaTypeMap }[],
> = Definition & {
  execute(...parameters: ParameterTuple<Parameters>): DBusPromise<unknown>;
};

type DBusRuntimeGetter<
  Definition extends {
    description: string;
  },
> = Definition & {
  get(): DBusPromise<unknown>;
};

type DBusRuntimeSetter<
  Definition extends {
    description: string;
  },
> = Definition & {
  set(value: unknown): DBusPromise<void>;
};

type OrcaModule<M> = M extends {
  commands: infer C;
  parameterizedCommands: infer PC;
  runtimeGetters: infer RG;
  runtimeSetters: infer RS;
}
  ? {
      commands: {
        [K in keyof C]: C[K] extends {
          description: string;
          representation?: string;
        }
          ? DBusCommand<C[K]>
          : never;
      };

      parameterizedCommands: {
        [K in keyof PC]: PC[K] extends {
          description: string;
          representation?: string;
          parameters: infer P extends readonly {
            type: keyof OrcaTypeMap;
          }[];
        }
          ? DBusParameterizedCommand<PC[K], P>
          : never;
      };

      runtimeGetters: {
        [K in keyof RG]: RG[K] extends {
          description: string;
        }
          ? DBusRuntimeGetter<RG[K]>
          : never;
      };

      runtimeSetters: {
        [K in keyof RS]: RS[K] extends {
          description: string;
        }
          ? DBusRuntimeSetter<RS[K]>
          : never;
      };
    }
  : never;

type OrcaService = {
  [K in keyof typeof serviceDefinition.modules]: OrcaModule<
    (typeof serviceDefinition.modules)[K]
  >;
};

type ActionOptions = Pick<CommandOptions, "capture">;

interface QueueAction {
  action: () => Promise<unknown>;
  options: ActionOptions;
  promise: Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

function isUnixSocket(path: string): boolean {
  try {
    return statSync(path).isSocket();
  } catch {
    return false;
  }
}

export class OrcaClient {
  #sessionDisplay = null;
  #sessionDBusAddress: string = null;
  #sessionDBus: MessageBus = null;
  #speechdProcess: ChildProcess = null;
  #speechdAddress: string = null;
  #orcaProcess: ChildProcess = null;
  #orcaService: OrcaService = null;

  #capture: CommandOptions["capture"];
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

  async #verifyXServer(): Promise<void> {
    debug("Verifying X Server running...");

    this.#sessionDisplay = process.env.DISPLAY;

    if (!this.#sessionDisplay) {
      throw new Error(ERR_ORCA_X_SERVER_DISPLAY_NOT_SET);
    }

    debug(`DISPLAY=${this.#sessionDisplay}`);
  }

  async #verifyDBus(): Promise<void> {
    debug("Verifying session D-Bus running...");

    this.#sessionDBusAddress = process.env.DBUS_SESSION_BUS_ADDRESS;

    if (!this.#sessionDBusAddress) {
      throw new Error(ERR_ORCA_DBUS_ADDRESS_NOT_SET);
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

  #verifyAtSpi() {
    debug("Verifying AT-SPI D-Bus running...");

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

    const socketPath = `${SPEECHD_DIR}/run/speechd.sock`;

    this.#speechdProcess = spawn("speech-dispatcher", [
      "--run-single",
      "--config-dir",
      SPEECHD_DIR,
      "--module-dir",
      `${SPEECHD_DIR}/modules`,
      "--communication-method",
      "unix_socket",
      "--socket-path",
      socketPath,
      "--log-dir",
      `${SPEECHD_DIR}/logs`,
      "--timeout",
      "0",
    ]);

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

    this.#speechdAddress = `unix_socket:${socketPath}`;

    debug(`SPEECHD_ADDRESS=${this.#speechdAddress}`);

    const startTime = Date.now();

    return new Promise<void>((resolve, reject) => {
      const poll = () => {
        if (Date.now() - startTime >= MAX_POLL_TIMEOUT) {
          reject(new Error(ERR_ORCA_SPEECH_DISPATCHER_SERVICE_TIMEOUT));

          return;
        }

        try {
          debug(`Polling for '${socketPath}' unix socket existence`);

          if (isUnixSocket(socketPath)) {
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

  #startOrca() {
    debug("Starting Orca");

    this.#orcaProcess = spawn("orca", ["--replace"], {
      env: {
        ...process.env,
        DBUS_SESSION_BUS_ADDRESS: this.#sessionDBusAddress,
        DISPLAY: this.#sessionDisplay,
        SPEECHD_ADDRESS: this.#speechdAddress,
      },
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
      await this.#verifyXServer();
      await this.#verifyDBus();
      await this.#verifyAtSpi();
      await this.#startSpeechd();
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

    if (this.#orcaProcess && this.#orcaProcess.exitCode === null) {
      debug("Terminating Orca...");

      this.#orcaProcess.kill("SIGTERM");
    }

    if (this.#speechdProcess && this.#speechdProcess.exitCode === null) {
      debug("Terminating Speech Dispatcher...");

      this.#speechdProcess.kill("SIGTERM");
    }

    this.#sessionDisplay = null;
    this.#sessionDBusAddress = null;
    this.#sessionDBus = null;
    this.#speechdProcess = null;
    this.#speechdAddress = null;
    this.#orcaProcess = null;
    this.#orcaService = null;

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
        // TODO: handle different capture options
        // TODO: wrap with speech capture logic and push to `spokenPhrases`

        debug("executing action");
        result = await action();
        debug("action completed");

        spokenPhrases.push("Spoken phrase capture not implemented");
      } else {
        result = await action();
      }

      const spokenPhrase = spokenPhrases.join(". ");

      this.#spokenPhrases.push(spokenPhrase);

      resolve({
        itemText: spokenPhrase ?? "",
        result,
        spokenPhrase: spokenPhrase ?? "",
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
