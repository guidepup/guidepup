export interface ScreenReaderCaption {
  /**
   * Get the last spoken phrase.
   *
   * @returns {Promise<string>} The last spoken phrase.
   */
  lastSpokenPhrase(): Promise<string>;

  /**
   * Get the text of the item in the screen reader cursor.
   *
   * @returns {Promise<string>} The item's text.
   */
  itemText(): Promise<string>;

  /**
   * Get the log of all spoken phrases for this screen reader instance.
   *
   * @returns {Promise<string[]>} The phrase log.
   */
  spokenPhraseLog(): Promise<string[]>;

  /**
   * Get the log of all visited item text for this screen reader instance.
   *
   * @returns {Promise<string[]>} The item text log.
   */
  itemTextLog(): Promise<string[]>;
}
