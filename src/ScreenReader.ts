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
   * Send a key code to the ScreenReader.
   *
   * @param {object} keyCodeCommand Key code command to send to the ScreenReader.
   */
  keyCode(command: KeyCodeCommand): Promise<void>;

  /**
   * Send a keystroke to the ScreenReader.
   *
   * @param {object} keystrokeCommand Keystroke command to send to the ScreenReader.
   */
  keystroke(command: KeystrokeCommand): Promise<void>;

  /**
   * Move the ScreenReader cursor up to a new location.
   */
  moveUp(): Promise<void>;

  /**
   * Move the ScreenReader cursor right to a new location.
   */
  moveRight(): Promise<void>;

  /**
   * Move the ScreenReader cursor down to a new location.
   */
  moveDown(): Promise<void>;

  /**
   * Move the ScreenReader cursor left to a new location.
   */
  moveLeft(): Promise<void>;

  /**
   * Click the mouse once.
   */
  click(): Promise<void>;

  /**
   * Double click the mouse.
   */
  doubleClick(): Promise<void>;

  /**
   * Triple click the mouse.
   */
  tripleClick(): Promise<void>;

  /**
   * Right click the mouse once.
   */
  rightClick(): Promise<void>;

  /**
   * Double right click the mouse.
   */
  rightDoubleClick(): Promise<void>;

  /**
   * Triple right click the mouse.
   */
  rightTripleClick(): Promise<void>;

  /**
   * Get the last spoken phrase.
   *
   * @returns {Promise<string>} The last spoken phrase.
   */
  getLastSpokenPhrase(): Promise<string>;

  /**
   * Get the text of the item in the ScreenReader cursor.
   *
   * @returns {Promise<string>} The item's text.
   */
  getText(): Promise<string>;
}

export interface ScreenReader {
  new (): ScreenReaderBase;
  /**
   * Detect whether the ScreenReader is supported for the current OS.
   *
   * @returns {boolean}
   */
  detect(): boolean;
  /**
   * Detect whether the ScreenReader is the default screen reader for the current OS.
   *
   * @returns {boolean}
   */
  default(): boolean;
}
