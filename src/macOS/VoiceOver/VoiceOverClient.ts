import {
  APPROX_WORDS_PER_SECOND,
  ITEM_TEXT_POLL_INTERVAL,
  ITEM_TEXT_RETRY_COUNT,
  MAX_SPOKEN_PHRASES_POLL_COUNT,
  SPOKEN_PHRASES_POLL_INTERVAL,
  SPOKEN_PHRASES_RETRY_COUNT,
} from "./constants";
import { cleanSpokenPhrase } from "./cleanSpokenPhrase";
import { CommandOptions } from "../../CommandOptions";
import { ERR_VOICE_OVER_NOT_RUNNING } from "../errors";
import { itemText as getItemText } from "./itemText";
import { lastSpokenPhrase } from "./lastSpokenPhrase";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function countApproxWords(str) {
  return str.trim().split(/\s+/).length;
}

interface QueueAction {
  action: () => Promise<unknown>;
  options?: Pick<CommandOptions, "capture">;
  promise: Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

export class VoiceOverClient {
  #inFlight: Promise<unknown> | null = null;
  #queue: QueueAction[] = [];
  #stopped = false;
  #capture: CommandOptions["capture"];
  #itemTextLogStore: string[] = [];
  #spokenPhraseLogStore: string[] = [];
  #clearedLastSpokenPhrase: string | null = null;

  constructor(options?: Pick<CommandOptions, "capture">) {
    this.#capture = options?.capture ?? true;
  }

  /**
   * Stop VoiceOver action execution.
   */
  async stop(): Promise<void> {
    this.#stopped = true;

    await this.#waitForAllActions();
  }

  /**
   * Get the text of the item in the VoiceOver cursor.
   *
   * @returns {Promise<string>} The item's text.
   */
  async itemText(): Promise<string> {
    return (await this.itemTextLog()).at(-1) ?? "";
  }

  /**
   * Get the last spoken phrase.
   *
   * @returns {Promise<string>} The last spoken phrase.
   */
  async lastSpokenPhrase(): Promise<string> {
    return (await this.spokenPhraseLog()).at(-1) ?? "";
  }

  /**
   * Get the item text log.
   *
   * @returns {Promise<string[]>} The item text log.
   */
  async itemTextLog(): Promise<string[]> {
    await this.#waitForAllActions();

    return this.#itemTextLogStore;
  }

  /**
   * Clear the item text log.
   */
  async clearItemTextLog(): Promise<void> {
    await this.#waitForAllActions();

    this.#itemTextLogStore = [];
  }

  /**
   * Get the spoken phrase log.
   *
   * @returns {Promise<string[]>} The spoken phrase log.
   */
  async spokenPhraseLog(): Promise<string[]> {
    await this.#waitForAllActions();

    return this.#spokenPhraseLogStore;
  }

  /**
   * Clear the spoken phrase log.
   */
  async clearSpokenPhraseLog(): Promise<void> {
    await this.#waitForAllActions();

    // Keep a reference to the last spoken phrase so we can continue to use the
    // same change detection technique.
    this.#clearedLastSpokenPhrase = this.#spokenPhraseLogStore.at(-1) ?? null;
    this.#spokenPhraseLogStore = [];
  }

  /**
   * Enqueues an action and captures the logs for the performed action until
   * they stabilize. Actions are executed serially in the order they are
   * enqueued. Returns a promise that resolves with the action's result.
   *
   * @param {() => Promise<T>} action The action to enqueue and execute.
   * @param {object} options Additional options.
   * @returns {Promise<T>} Promise that resolves with the action's result.
   */
  async enqueueAndTap<T>(
    action: () => Promise<T>,
    options?: Pick<CommandOptions, "capture">,
  ): Promise<T> {
    if (this.#stopped) {
      throw new Error(ERR_VOICE_OVER_NOT_RUNNING);
    }

    let resolve, reject;

    const promise = new Promise<T>((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });

    this.#queue.push({ action, options, promise, resolve, reject });
    this.#processQueue();

    return promise;
  }

  async #waitForAllActions(): Promise<void> {
    const allPromises = this.#queue.map(({ promise }) => promise);

    if (this.#inFlight) {
      allPromises.push(this.#inFlight);
    }

    await Promise.allSettled(allPromises);
  }

  async #processQueue() {
    if (this.#inFlight || this.#queue.length === 0) {
      return;
    }

    const { action, options, resolve, reject, promise } = this.#queue.shift()!;
    this.#inFlight = promise;

    try {
      if (this.#stopped) {
        throw new Error(ERR_VOICE_OVER_NOT_RUNNING);
      }

      const result = await action();

      if (options?.capture ?? this.#capture) {
        const [itemText, lastSpokenPhrase] = await Promise.all([
          this.#pollForItemText(),
          this.#pollForSpokenPhrases(options),
        ]);

        this.#itemTextLogStore.push(itemText);
        this.#spokenPhraseLogStore.push(lastSpokenPhrase);
      }

      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.#inFlight = null;
      this.#processQueue();
    }
  }

  async #pollForItemText() {
    for (let i = 0; i < ITEM_TEXT_RETRY_COUNT; i++) {
      let rawItemText = "";

      try {
        rawItemText = await getItemText();
      } catch {
        // swallow
      }

      const itemText = cleanSpokenPhrase(rawItemText);

      if (itemText) {
        return itemText;
      }

      await delay(ITEM_TEXT_POLL_INTERVAL);
    }

    return "";
  }

  async #pollForSpokenPhrases(options?: Pick<CommandOptions, "capture">) {
    // Attempt to combat VO picking up previous spoken phrase even though we
    // should be confident the action has completed.
    await delay(SPOKEN_PHRASES_POLL_INTERVAL);

    const previousSpokenPhrase =
      this.#spokenPhraseLogStore.at(-1) ?? this.#clearedLastSpokenPhrase ?? "";

    const phrases = [];
    let stableCount = 0;
    let pollCount = 0;

    while (pollCount < MAX_SPOKEN_PHRASES_POLL_COUNT) {
      let rawLastSpokenPhrase = "";

      try {
        rawLastSpokenPhrase = await lastSpokenPhrase();
      } catch {
        // swallow
      }

      const phrase = cleanSpokenPhrase(rawLastSpokenPhrase);

      let pollTimeout;

      if (!phrase) {
        // Error retrieving phrase
        pollTimeout = SPOKEN_PHRASES_POLL_INTERVAL;
      } else if (
        pollCount < SPOKEN_PHRASES_RETRY_COUNT / 2 &&
        phrase === previousSpokenPhrase
      ) {
        // Cater for VO not picking up the new phrase immediately
        pollTimeout = SPOKEN_PHRASES_POLL_INTERVAL;
      } else if (phrase === phrases.at(-1)) {
        stableCount++;
        pollTimeout = SPOKEN_PHRASES_POLL_INTERVAL;
      } else {
        const approxWords = countApproxWords(phrase);

        stableCount = 0;
        pollTimeout =
          (approxWords / APPROX_WORDS_PER_SECOND) * 1000 +
          SPOKEN_PHRASES_POLL_INTERVAL;

        phrases.push(phrase);
      }

      if (
        stableCount >= SPOKEN_PHRASES_RETRY_COUNT ||
        (options?.capture ?? this.#capture) === "initial"
      ) {
        break;
      }

      await delay(pollTimeout);

      pollCount++;
    }

    return phrases.filter(Boolean).join(". ");
  }
}
