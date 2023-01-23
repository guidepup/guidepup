import { cleanSpokenPhrase } from "./cleanSpokenPhrase";
import { DEFAULT_GUIDEPUP_VOICEOVER_SETTINGS } from "./configureSettings";
import { itemText as getItemText } from "./itemText";
import { lastSpokenPhrase } from "./lastSpokenPhrase";

const SPOKEN_PHRASES_POLL_INTERVAL = 100;
const SPOKEN_PHRASES_RETRY_COUNT = 5;
const APPROX_WORDS_PER_SECOND =
  DEFAULT_GUIDEPUP_VOICEOVER_SETTINGS.rateAsPercent / 10;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function countApproxWords(str) {
  return str.trim().split(/\s+/).length;
}

export class LogStore {
  #activePromise = null;

  #itemTextLogStore = [];
  #spokenPhraseLogStore = [];

  /**
   * Get the text of the item in the VoiceOver cursor.
   *
   * @returns {Promise<string>} The item's text.
   */
  async itemText(): Promise<string> {
    return (await this.itemTextLog()).at(-1);
  }

  /**
   * Get the last spoken phrase.
   *
   * @returns {Promise<string>} The last spoken phrase.
   */
  async lastSpokenPhrase(): Promise<string> {
    return (await this.spokenPhraseLog()).at(-1);
  }

  /**
   * Get the item text logs.
   *
   * @returns {Promise<string[]>} The item text log.
   */
  async itemTextLog(): Promise<string[]> {
    if (this.#activePromise) {
      await this.#activePromise;
    }

    // Edge-case that ask for phrase before performing any actions.
    if (!this.#itemTextLogStore.length) {
      await this.tap(Promise.resolve());
    }

    return this.#itemTextLogStore;
  }

  /**
   * Get the last spoken phrase logs.
   *
   * @returns {Promise<string[]>} The spoken phrase log.
   */
  async spokenPhraseLog(): Promise<string[]> {
    if (this.#activePromise) {
      await this.#activePromise;
    }

    // Edge-case that ask for phrase before performing any actions.
    if (!this.#spokenPhraseLogStore.length) {
      await this.tap(Promise.resolve());
    }

    return this.#spokenPhraseLogStore;
  }

  /**
   * Waits for the provided promise to resolve and then captures the logs for
   * the performed action until they stabilize.
   *
   * @param {Promise<unknown>} promise Underlying action to capture logs for.
   * @returns {Promise<unknown>}
   */
  async tap<T, S extends Promise<T>>(promise: S): Promise<T> {
    let activePromiseResolver: () => void;
    this.#activePromise = new Promise<void>(
      (resolve) => (activePromiseResolver = resolve)
    );

    const result = await promise;

    const [itemText, lastSpokenPhrase] = await Promise.all([
      getItemText().then(cleanSpokenPhrase),
      this.#pollForSpokenPhrases(),
    ]);

    this.#itemTextLogStore.push(itemText);
    this.#spokenPhraseLogStore.push(lastSpokenPhrase);

    activePromiseResolver();
    this.#activePromise = null;

    return result;
  }

  async #pollForSpokenPhrases() {
    const phrases = [];
    let stableCount = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const phrase = cleanSpokenPhrase(await lastSpokenPhrase());

      let pollTimeout;

      if (phrase === phrases.at(-1)) {
        stableCount++;
        pollTimeout = SPOKEN_PHRASES_POLL_INTERVAL;
      } else {
        const approxWords = countApproxWords(phrase);

        stableCount = 0;
        pollTimeout =
          (approxWords / APPROX_WORDS_PER_SECOND) * 1000 -
          SPOKEN_PHRASES_POLL_INTERVAL;

        phrases.push(phrase);
      }

      if (stableCount < SPOKEN_PHRASES_RETRY_COUNT) {
        await delay(pollTimeout);
      } else {
        break;
      }
    }

    return phrases.filter(Boolean).join(". ");
  }
}
