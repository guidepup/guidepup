import {
  APPROX_WORDS_PER_SECOND,
  ITEM_TEXT_POLL_INTERVAL,
  ITEM_TEXT_RETRY_COUNT,
  SPOKEN_PHRASES_POLL_INTERVAL,
  SPOKEN_PHRASES_RETRY_COUNT,
} from "./constants";
import { cleanSpokenPhrase } from "./cleanSpokenPhrase";
import { CommandOptions } from "../../CommandOptions";
import { itemText as getItemText } from "./itemText";
import { lastSpokenPhrase } from "./lastSpokenPhrase";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function countApproxWords(str) {
  return str.trim().split(/\s+/).length;
}

export class LogStore {
  #activePromise = null;
  #capture: CommandOptions["capture"];
  #itemTextLogStore: string[] = [];
  #spokenPhraseLogStore: string[] = [];

  constructor(options?: Pick<CommandOptions, "capture">) {
    this.#capture = options?.capture ?? true;
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
    if (this.#activePromise) {
      await this.#activePromise;
    }

    return this.#itemTextLogStore;
  }

  /**
   * Clear the item text log.
   */
  async clearItemTextLog(): Promise<void> {
    if (this.#activePromise) {
      await this.#activePromise;
    }

    this.#itemTextLogStore = [];
  }

  /**
   * Get the spoken phrase log.
   *
   * @returns {Promise<string[]>} The spoken phrase log.
   */
  async spokenPhraseLog(): Promise<string[]> {
    if (this.#activePromise) {
      await this.#activePromise;
    }

    return this.#spokenPhraseLogStore;
  }

  /**
   * Clear the spoken phrase log.
   */
  async clearSpokenPhraseLog(): Promise<void> {
    if (this.#activePromise) {
      await this.#activePromise;
    }

    this.#spokenPhraseLogStore = [];
  }

  /**
   * Waits for the provided promise to resolve and then captures the logs for
   * the performed action until they stabilize.
   *
   * @param {Promise<unknown>} promise Underlying action to capture logs for.
   * @param {object} options Additional options.
   * @returns {Promise<unknown>}
   */
  async tap<T, S extends Promise<T>>(
    action: () => S,
    options?: Pick<CommandOptions, "capture">
  ): Promise<T> {
    if (this.#activePromise) {
      await this.#activePromise;
    }

    let activePromiseResolver: () => void;
    this.#activePromise = new Promise<void>(
      (resolve) => (activePromiseResolver = resolve)
    );

    let result: T;

    try {
      result = await action();

      if (options?.capture ?? this.#capture) {
        const [itemText, lastSpokenPhrase] = await Promise.all([
          this.#pollForItemText(),
          this.#pollForSpokenPhrases(options),
        ]);

        this.#itemTextLogStore.push(itemText);
        this.#spokenPhraseLogStore.push(lastSpokenPhrase);
      }
    } finally {
      activePromiseResolver();
      this.#activePromise = null;
    }

    return result;
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

    const previousSpokenPhrase = this.#spokenPhraseLogStore.at(-1) ?? "";

    const phrases = [];
    let stableCount = 0;
    let firstPoll = true;

    // eslint-disable-next-line no-constant-condition
    while (true) {
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
      } else if (firstPoll && phrase === previousSpokenPhrase) {
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

      firstPoll = false;
    }

    return phrases.filter(Boolean).join(". ");
  }
}
