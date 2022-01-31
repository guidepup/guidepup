import type { CommandOptions } from "./CommandOptions";
import type { ScreenReaderCaption } from "./ScreenReaderCaption";
import type { ScreenReaderCursor } from "./ScreenReaderCursor";
import type { ScreenReaderKeyboard } from "./ScreenReaderKeyboard";
import type { ScreenReaderMouse } from "./ScreenReaderMouse";

export interface ScreenReaderInstance {
  /**
   * Turn the ScreenReader on.
   */
  start(options?: CommandOptions): Promise<void>;

  /**
   * Turn the ScreenReader off.
   */
  stop(options?: CommandOptions): Promise<void>;

  /**
   * ScreenReader caption APIs.
   */
  caption: ScreenReaderCaption;

  /**
   * ScreenReader cursor APIs.
   */
  cursor: ScreenReaderCursor;

  /**
   * ScreenReader keyboard APIs.
   */
  keyboard: ScreenReaderKeyboard;

  /**
   * ScreenReader mouse APIs.
   */
  mouse: ScreenReaderMouse;
}

export interface ScreenReader {
  new (): ScreenReaderInstance;
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
