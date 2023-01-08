import { ScreenReader } from "./ScreenReader";

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
   * the performed action.
   *
   * @param {Promise<unknown>} promise Underlying action to capture logs for.
   * @returns {Promise<unknown>}
   */
  async tap<T, S extends Promise<T>>(promise: S): Promise<T> {
    const result = await promise;

    const [itemText, lastSpokenPhrase] = await Promise.all([
      this.#screenReader.itemText(),
      this.#screenReader.lastSpokenPhrase(),
    ]);

    this.#itemTextLogStore.push(itemText);
    this.#spokenPhraseLogStore.push(lastSpokenPhrase);

    return result;
  }
}
