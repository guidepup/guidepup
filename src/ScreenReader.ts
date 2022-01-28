import type { KeyCodeCommand } from "./KeyCodeCommand";
import type { KeystrokeCommand } from "./KeystrokeCommand";

export interface ScreenReaderBase {
  /**
   * Turn the ScreenReader on.
   */
  start(): Promise<void>;

  /**
   * Turn the ScreenReader off.
   */
  stop(): Promise<void>;

  /**
   * Send a key code or keystroke to the ScreenReader.
   *
   * @param {object} keyCommand Key code or keystroke command to send to the ScreenReader.
   */
  sendKeys(command: KeyCodeCommand | KeystrokeCommand): Promise<void>;

  /**
   * Move the ScreenReader cursor to the previous location.
   */
  movePrevious(): Promise<void>;

  /**
   * Move the ScreenReader cursor to the next location.
   */
  moveNext(): Promise<void>;

  /**
   * Perform default action.
   */
  performAction(): Promise<void>;

  /**
   * Get the last spoken phrase.
   *
   * @returns {Promise<string>} The last spoken phrase.
   */
  getLastSpokenPhrase(): Promise<string>;

  /**
   * Get the log of all spoken phrases for this ScreenReader instance.
   *
   * @returns {string[]} The phrase log.
   */
  getSpokenPhraseLog(): string[];

  /**
   * Get the text of the item in the ScreenReader cursor.
   *
   * @returns {Promise<string>} The item's text.
   */
  getItemText(): Promise<string>;

  /**
   * Get the log of all visited item text for this ScreenReader instance.
   *
   * @returns {string[]} The item text log.
   */
  getItemTextLog(): string[];
}

export interface ScreenReader {
  new (): ScreenReaderBase;
  /**
   * Detect whether the ScreenReader is supported for the current OS.
   *
   * @returns {Promise<boolean>}
   */

  detect(): Promise<boolean>;
  /**
   * Detect whether the ScreenReader is the default screen reader for the current OS.
   *
   * @returns {Promise<boolean>}
   */
  default(): Promise<boolean>;
}
