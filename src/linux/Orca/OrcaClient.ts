import { ChildProcess, execFileSync, spawn } from "node:child_process";
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

const debug = base.extend("OrcaClient");

const POLL_INTERVAL = 2_000;

const ATSPI_LAUNCHER = "/usr/libexec/at-spi-bus-launcher";
const DBUS_ORCA_WELL_KNOWN_SERVICE_NAME = "org.gnome.Orca.Service";
const ORCA_DEBUG_FILE = "/tmp/guidepup-orca-debug.log";

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

  #dbusAddress = null;
  #bus: MessageBus = null;
  #dbusOrcaService: DBusService = null;

  #orcaService: OrcaService = null;

  #dbusPid: number = null;
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

  async #startDBus(): Promise<void> {
    debug("[1/4] Ensuring session D-Bus...");

    const existingAddress = process.env.DBUS_SESSION_BUS_ADDRESS;

    if (existingAddress) {
      debug(`Using existing session D-Bus: ${existingAddress}`);

      this.#dbusAddress = existingAddress;
      this.#bus = sessionBus({
        busAddress: this.#dbusAddress,
      });

      try {
        await this.#bus.listNames();

        debug("Existing session D-Bus is reachable");

        return;
      } catch {
        debug(
          "Existing D-Bus address is unavailable; starting isolated session",
        );
      }
    }

    try {
      const output = execFileSync("dbus-launch", [], {
        encoding: "utf8",
        env: { ...process.env, DISPLAY: this.#display },
      });

      const addressMatch = output.match(/DBUS_SESSION_BUS_ADDRESS=([^\n]+)/);
      const pidMatch = output.match(/DBUS_SESSION_BUS_PID=(\d+)/);

      if (!addressMatch || !pidMatch) {
        throw new Error(`Failed to parse dbus-launch output:\n${output}`);
      }

      this.#dbusAddress = addressMatch[1];

      // Store the PID instead of a ChildProcess object so we can kill it later
      this.#dbusPid = parseInt(pidMatch[1], 10);

      debug(`\tD-Bus Address: ${this.#dbusAddress} (PID: ${this.#dbusPid})`);

      this.#bus = sessionBus({ busAddress: this.#dbusAddress });
    } catch (error) {
      debug("D-Bus error:", error);
      throw error;
    }
  }

  #startAtSpi() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve, reject) => {
      debug("[2/4] Ensuring AT-SPI...");

      try {
        const names = await this.#bus.listNames();

        if (names.includes("org.a11y.Bus")) {
          debug("AT-SPI already running; reusing existing bus");

          return;
        }
      } catch {
        // swallow
      }

      debug("AT-SPI not running; starting launcher");

      this.#atSpiProcess = spawn(ATSPI_LAUNCHER, ["--launch-immediately"], {
        env: {
          ...process.env,
          DISPLAY: this.#display,
          DBUS_SESSION_BUS_ADDRESS: this.#dbusAddress,
        },
      });

      this.#atSpiProcess.on("error", (error) => {
        debug("AT-SPI error:", error);

        reject(error);
      });

      this.#atSpiProcess.stdout?.on("data", (data) => {
        debug(`AT-SPI stdout: ${data.toString().trim()}`);
      });

      this.#atSpiProcess.stderr?.on("data", (data) => {
        debug(`AT-SPI stderr: ${data.toString().trim()}`);
      });

      this.#atSpiProcess.once("exit", (code, signal) => {
        debug(`AT-SPI exited (code=${code}, signal=${signal})`);

        if (code !== 0) {
          reject(
            new Error(
              `AT-SPI launcher exited before startup (code=${code}, signal=${signal})`,
            ),
          );
        }
      });

      const startTime = Date.now();

      const poll = async () => {
        if (Date.now() - startTime >= 30_000) {
          reject(new Error("TODO: Timed out waiting for AT-SPI D-Bus service"));

          return;
        }

        try {
          const names = await this.#bus.listNames();

          debug("Polling for 'org.a11y.Bus'", names);

          if (names.includes("org.a11y.Bus")) {
            resolve();

            return;
          }
        } catch (error) {
          reject(error);

          return;
        }

        setTimeout(poll, POLL_INTERVAL);
      };

      poll();
    });
  }

  #startOrca() {
    return new Promise<void>((resolve, reject) => {
      debug("[3/4] Starting Orca");

      this.#orcaProcess = spawn(
        "orca",
        ["--replace", "--debug", `--debug-file=${ORCA_DEBUG_FILE}`],
        {
          env: {
            ...process.env,
            DISPLAY: this.#display,
            DBUS_SESSION_BUS_ADDRESS: this.#dbusAddress,
          },
        },
      );

      const orcaDebugProcess = spawn("tail", ["-F", ORCA_DEBUG_FILE]);

      orcaDebugProcess.stdout?.on("data", (data) => {
        debug(`Orca debug: ${data.toString().trim()}`);
      });

      orcaDebugProcess.stderr?.on("data", (data) => {
        debug(`Orca debug tail error: ${data.toString().trim()}`);
      });

      this.#orcaProcess.once("exit", (code, signal) => {
        debug(`Orca exited (code=${code}, signal=${signal})`);

        orcaDebugProcess.kill();

        if (code !== 0) {
          reject(new Error(`Orca exited prematurely with code ${code}`));
        }
      });

      this.#orcaProcess.on("error", (error) => {
        debug("Orca error:", error);

        reject(error);
      });

      this.#orcaProcess.stdout?.on("data", (data) => {
        debug(`Orca stdout: ${data.toString().trim()}`);
      });

      this.#orcaProcess.stderr?.on("data", (data) => {
        debug(`Orca stderr: ${data.toString().trim()}`);
      });

      const startTime = Date.now();

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
          const output = execFileSync(
            "gdbus",
            [
              "call",
              "--session",
              "--dest",
              DBUS_ORCA_WELL_KNOWN_SERVICE_NAME,
              "--object-path",
              "/org/gnome/Orca/Service",
              "--method",
              "org.gnome.Orca.Service.GetVersion",
            ],
            {
              encoding: "utf8",
              env: {
                ...process.env,
                DBUS_SESSION_BUS_ADDRESS: this.#dbusAddress,
              },
            },
          );

          debug(`Orca GetVersion: ${output.trim()}`);
        } catch (error) {
          debug(`Orca GetVersion failed: ${error}`);
        }

        try {
          debug(
            `Polling for '${DBUS_ORCA_WELL_KNOWN_SERVICE_NAME}' name ownership`,
          );

          const hasOwner = await this.#bus.nameHasOwner(
            DBUS_ORCA_WELL_KNOWN_SERVICE_NAME,
          );

          if (hasOwner) {
            resolve();

            return;
          }
        } catch (error) {
          reject(error);

          return;
        }

        setTimeout(poll, POLL_INTERVAL);
      };

      poll();
    });
  }

  async #connect() {
    debug("[4/4] Connecting to Orca D-Bus service...");

    this.#dbusOrcaService = this.#bus.getService(
      DBUS_ORCA_WELL_KNOWN_SERVICE_NAME,
    );

    const entries = await Promise.all(
      Object.entries(DBUS_ORCA_COMMANDS).map(async ([name, { objectPath }]) => {
        const service = await this.#dbusOrcaService.getInterface(
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

  async start(options: { display?: string } = {}) {
    if (this.#started || this.#starting) {
      return;
    }

    this.#starting = true;

    this.#display = options?.display ?? process.env.DISPLAY;

    debug(`DISPLAY=${this.#display}`);

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

    if (this.#dbusPid) {
      debug("Killing D-Bus...");

      try {
        process.kill(this.#dbusPid, "SIGTERM");
      } catch {
        // Best effort
      }
    }

    this.#orcaProcess = null;
    this.#atSpiProcess = null;
    this.#dbusPid = null;

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
