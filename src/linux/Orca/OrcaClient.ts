import { type DBusPromise, type MessageBus, sessionBus } from "dbus-native";
import type { Capture } from "../../Capture";
import type { CommandOptions } from "../../CommandOptions";
import { ERR_ORCA_NOT_RUNNING } from "../errors";

const SERVICE = "org.gnome.Orca.Service";

const OBJECT_PATHS = {
  // TODO: generate all
  CaretNavigator: "/org/gnome/Orca/Service/CaretNavigator",
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
  #bus: MessageBus = null;
  #capture: CommandOptions["capture"];
  #inFlight: Promise<unknown> | null = null;
  #queue: QueueAction[] = [];
  #service: OrcaService = null;
  #spokenPhrases = [];
  #stopped = false;

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

  /**
   * Connect to an Orca instance.
   */
  async connect(options?: Pick<CommandOptions, "capture">): Promise<void> {
    this.#bus = sessionBus();

    const entries = await Promise.all(
      Object.entries(OBJECT_PATHS).map(async ([name, objectPath]) => {
        const service = await this.#bus.getInterface(
          SERVICE,
          objectPath,
          "org.gnome.Orca.Module",
        );

        return [name, service] as const;
      }),
    );

    this.#service = Object.fromEntries(entries) as unknown as OrcaService;

    // TODO: handle speech output connection as well

    this.#capture = options?.capture;
  }

  /**
   * Disconnect the Orca connection.
   */
  async disconnect(): Promise<void> {
    try {
      await this.#bus?.close();
    } catch {
      // swallow
    }

    this.#bus = null;
    this.#service = null;
  }

  /**
   * Stop Orca action execution.
   */
  async stop(): Promise<void> {
    this.#stopped = true;

    await this.#waitForAllActions();
    await this.disconnect();
  }

  getService(): OrcaService {
    if (!this.#service) {
      throw new Error("OrcaClient is not connected");
    }

    return this.#service;
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
    if (this.#stopped) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

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

    const { action, options, resolve, reject, promise } = this.#queue.shift()!;
    this.#inFlight = promise;

    try {
      if (this.#stopped) {
        throw new Error(ERR_ORCA_NOT_RUNNING);
      }

      const spokenPhrases: string[] = [];
      let result: unknown;

      if (options?.capture ?? this.#capture) {
        // TODO: handle different capture options
        // TODO: wrap with speech capture logic and push to `spokenPhrases`

        result = await action();

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
