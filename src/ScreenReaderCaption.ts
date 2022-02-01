import type { CommandOptions } from "./CommandOptions";

export interface ScreenReaderCaption {
  /**
   * Get the last spoken phrase.
   *
   * @param {object} [options] Additional options.
   * @returns {Promise<string>} The last spoken phrase.
   */
  lastSpokenPhrase(options?: CommandOptions): Promise<string>;

  /**
   * Get the text of the item in the ScreenReader cursor.
   *
   * @param {object} [options] Additional options.
   * @returns {Promise<string>} The item's text.
   */
  itemText(options?: CommandOptions): Promise<string>;

  /**
   * Get the log of all spoken phrases for this ScreenReader instance.
   *
   * @returns {string[]} The phrase log.
   */
  spokenPhraseLog(): string[];

  /**
   * Get the log of all visited item text for this ScreenReader instance.
   *
   * @returns {string[]} The item text log.
   */
  itemTextLog(): string[];
}
