import { ChildProcess, spawn } from "node:child_process";
import { type DBusPromise, type MessageBus, sessionBus } from "dbus-native";
import { base } from "../../debug";
import type { Capture } from "../../Capture";
import type { CommandOptions } from "../../CommandOptions";
import { ERR_ORCA_NOT_RUNNING } from "../errors";

const debug = base.extend("OrcaClient");

const POLL_INTERVAL = 500;

const DBUS_ORCA_WELL_KNOWN_SERVICE_NAME = "org.gnome.Orca.Service";

const DBUS_ORCA_COMMANDS = {
  // TODO: generate all
  CaretNavigator: {
    objectPath: "/org/gnome/Orca/Service/CaretNavigator",
  },
  FlatReviewPresenter: {
    objectPath: "/org/gnome/Orca/Service/FlatReviewPresenter",
  },
  ObjectNavigator: {
    objectPath: "/org/gnome/Orca/Service/ObjectNavigator",
  },
  StructuralNavigator: {
    objectPath: "/org/gnome/Orca/Service/StructuralNavigator",
  },
  WhereAmIPresenter: {
    objectPath: "/org/gnome/Orca/Service/WhereAmIPresenter",
  },
} as const;

interface OrcaModule {
  ExecuteCommand(command: string, notifyUser: boolean): DBusPromise<void>;
}

interface OrcaService {
  // TODO: generate all
  CaretNavigator: OrcaModule;
  FlatReviewPresenter: OrcaModule;
  ObjectNavigator: OrcaModule;
  StructuralNavigator: OrcaModule;
  WhereAmIPresenter: OrcaModule;
}

type ActionOptions = Pick<CommandOptions, "capture">;

interface QueueAction {
  action: () => Promise<unknown>;
  options: ActionOptions;
  promise: Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

export class OrcaClient {
  #display = null;

  #sessionDBusAddress = null;
  #atSpiDBusAddress = null;

  #sessionDBus: MessageBus = null;
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

    this.#display = process.env.DISPLAY;

    if (!this.#display) {
      throw new Error("TODO: X Server must be running and DISPLAY set");
    }

    debug(`DISPLAY=${this.#display}`);
  }

  async #verifyDBus(): Promise<void> {
    debug("Verifying session D-Bus running...");

    this.#sessionDBusAddress = process.env.DBUS_SESSION_BUS_ADDRESS;

    if (!this.#sessionDBusAddress) {
      throw new Error(
        "TODO: D-Bus must be running and DBUS_SESSION_BUS_ADDRESS set",
      );
    }

    debug(`DBUS_SESSION_BUS_ADDRESS=${this.#sessionDBusAddress}`);

    this.#sessionDBus = sessionBus({
      busAddress: this.#sessionDBusAddress,
    });

    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const poll = async () => {
        if (Date.now() - startTime >= 30_000) {
          reject(new Error("TODO: Timed out waiting for D-Bus"));

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

    this.#atSpiDBusAddress = process.env.AT_SPI_BUS_ADDRESS;

    if (!this.#atSpiDBusAddress) {
      throw new Error(
        "TODO: AT-SPI D-Bus must be running and AT_SPI_BUS_ADDRESS set",
      );
    }

    debug(`AT_SPI_BUS_ADDRESS=${this.#atSpiDBusAddress}`);

    const startTime = Date.now();

    return new Promise<void>((resolve, reject) => {
      const poll = async () => {
        if (Date.now() - startTime >= 30_000) {
          reject(new Error("TODO: Timed out waiting for AT-SPI D-Bus service"));

          return;
        }

        try {
          const names = await this.#sessionDBus.listNames();

          debug("Polling for 'org.a11y.Bus' registration", names);

          if (names.includes("org.a11y.Bus")) {
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
    debug("[3/4] Starting Orca");

    this.#orcaProcess = spawn("orca", ["--replace"], {
      env: {
        ...process.env,
        DISPLAY: this.#display,
        DBUS_SESSION_BUS_ADDRESS: this.#sessionDBusAddress,
      },
    });

    const startTime = Date.now();

    return new Promise<void>((resolve, reject) => {
      const poll = async () => {
        if (Date.now() - startTime >= 30_000) {
          reject(
            new Error(
              `TODO: Timed out waiting for '${DBUS_ORCA_WELL_KNOWN_SERVICE_NAME}' D-Bus service`,
            ),
          );

          return;
        }

        try {
          debug(
            `Polling for '${DBUS_ORCA_WELL_KNOWN_SERVICE_NAME}' name ownership`,
          );

          const hasOwner = await this.#sessionDBus.nameHasOwner(
            DBUS_ORCA_WELL_KNOWN_SERVICE_NAME,
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

  async #mapOrcaDBusService() {
    debug("[4/4] Connecting to Orca D-Bus service...");

    const sessionDBusOrcaService = this.#sessionDBus.getService(
      DBUS_ORCA_WELL_KNOWN_SERVICE_NAME,
    );

    const entries = await Promise.all(
      Object.entries(DBUS_ORCA_COMMANDS).map(async ([name, { objectPath }]) => {
        const service = await sessionDBusOrcaService.getInterface(
          objectPath,
          "org.gnome.Orca.Module",
        );

        debug(objectPath, "org.gnome.Orca.Module", service);

        return [name, service] as const;
      }),
    );

    this.#orcaService = Object.fromEntries(entries) as unknown as OrcaService;

    debug(
      `Ready: Successfully mapped interface ${DBUS_ORCA_WELL_KNOWN_SERVICE_NAME}.`,
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
      await this.#startOrca();
      await this.#mapOrcaDBusService();

      this.#started = true;
    } catch (cause) {
      throw new Error("TODO: start error", { cause });
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

    this.#display = null;

    this.#sessionDBusAddress = null;
    this.#atSpiDBusAddress = null;

    this.#sessionDBus = null;
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
