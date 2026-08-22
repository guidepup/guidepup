import { ChildProcess, spawn } from "node:child_process";
import {
  type DBusPromise,
  DBusService,
  type MessageBus,
  sessionBus,
} from "dbus-native";
import { base } from "../../debug";
import type { Capture } from "../../Capture";
import type { CommandOptions } from "../../CommandOptions";
import { ERR_ORCA_NOT_RUNNING } from "../errors";
import { waitForRunning } from "./waitForRunning";

const debug = base.extend("OrcaClient");

const ATSPI_LAUNCHER = "/usr/libexec/at-spi-bus-launcher";
const DBUS_ORCA_WELL_KNOWN_SERVICE_NAME = "org.gnome.Orca.Service";

const DBUS_ORCA_COMMANDS = {
  // TODO: generate all
  CaretNavigator: {
    objectPath: "/org/gnome/Orca/Service/CaretNavigator",
    interface: "org.gnome.Orca.CaretNavigator",
  },
};

const killProcess = (process, name) => {
  if (process && process.exitCode === null) {
    debug(`Killing ${name}...`);

    process.kill("SIGTERM");
  }
};

interface OrcaModule {
  ExecuteCommand(command: string, notifyUser: boolean): DBusPromise<void>;
}

interface OrcaService {
  // TODO: generate all
  CaretNavigator: OrcaModule;
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

  #dbusAddress = null;
  #bus: MessageBus = null;
  #dbusOrcaService: DBusService = null;

  #orcaService: OrcaService = null;

  #xvfbProcess: ChildProcess = null;
  #dbusProcess: ChildProcess = null;
  #atSpiProcess: ChildProcess = null;
  #orcaProcess: ChildProcess = null;

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

  #startDBus() {
    return new Promise<void>((resolve, reject) => {
      debug("[2/5] Starting isolated session D-Bus...");

      this.#dbusProcess = spawn(
        "dbus-daemon",
        ["--session", "--print-address", "--nofork"],
        { env: { ...process.env, DISPLAY: this.#display } },
      );

      this.#dbusProcess.on("error", reject);

      this.#dbusProcess.stdout.once("data", (data) => {
        this.#dbusAddress = data.toString().trim();

        debug(`\tD-Bus Address: ${this.#dbusAddress}`);

        resolve();
      });
    });
  }

  #startAtSpi() {
    return new Promise((resolve, reject) => {
      debug("[3/5] Starting AT-SPI...");

      this.#atSpiProcess = spawn(ATSPI_LAUNCHER, ["--launch-immediately"], {
        env: {
          ...process.env,
          DISPLAY: this.#display,
          DBUS_SESSION_BUS_ADDRESS: this.#dbusAddress,
        },
      });

      this.#atSpiProcess.on("error", reject);

      setTimeout(resolve, 500);
    });
  }

  #startOrca() {
    return new Promise((resolve, reject) => {
      debug(`[4/5] Starting application: "orca --replace"...`);

      this.#orcaProcess = spawn("orca", ["--replace"], {
        env: {
          ...process.env,
          DISPLAY: this.#display,
          DBUS_SESSION_BUS_ADDRESS: this.#dbusAddress,
        },
      });

      this.#orcaProcess.once("exit", (code) => {
        if (!this.#started && code !== 0) {
          reject(new Error(`Application exited prematurely with code ${code}`));
        }
      });

      this.#orcaProcess.on("error", reject);

      waitForRunning().then(resolve, reject);
    });
  }

  async #connect() {
    debug("[5/5] Connecting Node to D-Bus and verifying services...");
    this.#bus = sessionBus({ busAddress: this.#dbusAddress });

    const names = await this.#bus.listNames();

    if (!names.includes(DBUS_ORCA_WELL_KNOWN_SERVICE_NAME)) {
      throw new Error("TODO: error for not registered");
    }

    this.#dbusOrcaService = this.#bus.getService(
      DBUS_ORCA_WELL_KNOWN_SERVICE_NAME,
    );

    const entries = await Promise.all(
      Object.entries(DBUS_ORCA_COMMANDS).map(async ([name, { objectPath }]) => {
        const service = await this.#dbusOrcaService.getInterface(
          objectPath,
          "org.gnome.Orca.Module",
        );

        return [name, service] as const;
      }),
    );

    this.#orcaService = Object.fromEntries(entries) as unknown as OrcaService;

    debug(
      `Ready: Successfully mapped interface ${DBUS_ORCA_WELL_KNOWN_SERVICE_NAME}.`,
    );
  }

  async start(options: { display?: string } = {}) {
    if (this.#started || this.#starting) {
      return;
    }

    this.#starting = true;

    this.#display = options?.display ?? process.env.DISPLAY;

    if (!this.#display) {
      throw new Error("TODO: X server not running error");
    }

    try {
      await this.#startDBus();
      await this.#startAtSpi();
      await this.#startOrca();
      await this.#connect();

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

    if (this.#bus) {
      await this.#bus.close();

      this.#bus = null;
    }

    this.#dbusOrcaService = null;

    killProcess(this.#orcaProcess, "Orca");
    killProcess(this.#atSpiProcess, "AT-SPI");
    killProcess(this.#dbusProcess, "D-Bus");
    killProcess(this.#xvfbProcess, "Xvfb");

    this.#orcaProcess = null;
    this.#atSpiProcess = null;
    this.#dbusProcess = null;
    this.#xvfbProcess = null;

    this.#stopping = false;
    this.#started = false;
  }

  get service(): OrcaService {
    if (!this.#started || this.#stopping || !this.#dbusOrcaService) {
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
