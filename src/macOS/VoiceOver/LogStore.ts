import { DEFAULT_GUIDEPUP_VOICEOVER_SETTINGS } from "./configureSettings";
import { ScreenReader } from "../../ScreenReader";

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
  #screenReader!: ScreenReader;
  #itemTextLogStore = [];
  #spokenPhraseLogStore = [];

  constructor(screenReader: ScreenReader) {
    this.#screenReader = screenReader;
  }

  /**
   * Get the item text logs.
   *
   * @returns {string[]} The item text log.
   */
  get itemTextLog(): string[] {
    return this.#itemTextLogStore;
  }

  /**
   * Get the last spoken phrase logs.
   *
   * @returns {string[]} The spoken phrase log.
   */
  get spokenPhraseLog(): string[] {
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
    const result = await promise;

    const [itemText, lastSpokenPhrase] = await Promise.all([
      this.#screenReader.caption.itemText(),
      this.#pollForSpokenPhrases(),
    ]);

    this.#itemTextLogStore.push(itemText);
    this.#spokenPhraseLogStore.push(lastSpokenPhrase);

    return result;
  }

  async #pollForSpokenPhrases() {
    const phrases = [];
    let stableCount = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const lastSpokenPhrase =
        await this.#screenReader.caption.lastSpokenPhrase();

      let pollTimeout;

      if (lastSpokenPhrase === phrases.at(-1)) {
        stableCount++;
        pollTimeout = SPOKEN_PHRASES_POLL_INTERVAL;
      } else {
        const approxWords = countApproxWords(lastSpokenPhrase);

        stableCount = 0;
        pollTimeout =
          (approxWords / APPROX_WORDS_PER_SECOND) * 1000 -
          SPOKEN_PHRASES_POLL_INTERVAL;

        phrases.push(lastSpokenPhrase);
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
