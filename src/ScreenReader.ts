import type { ClickOptions } from "./ClickOptions";
import type { CommandOptions } from "./CommandOptions";
import type { KeyboardOptions } from "./KeyboardOptions";
import type { ScreenReaderCaption } from "./ScreenReaderCaption";
import type { ScreenReaderCursor } from "./ScreenReaderCursor";
import type { ScreenReaderKeyboard } from "./ScreenReaderKeyboard";
import type { ScreenReaderMouse } from "./ScreenReaderMouse";

export interface ScreenReaderInstance {
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

  /**
   * Turn the ScreenReader on.
   *
   * @param {object} [options] Additional options.
   */
  start(options?: CommandOptions): Promise<void>;

  /**
   * Turn the ScreenReader off.
   *
   * @param {object} [options] Additional options.
   */
  stop(options?: CommandOptions): Promise<void>;

  /**
   * Move the ScreenReader cursor to the previous location.
   *
   * @param {object} [options] Additional options.
   */
  previous(options?: CommandOptions): Promise<void>;

  /**
   * Move the ScreenReader cursor to the next location.
   *
   * @param {object} [options] Additional options.
   */
  next(options?: CommandOptions): Promise<void>;

  /**
   * Perform the default action for the item in the ScreenReader cursor.
   *
   * @param {object} [options] Additional options.
   */
  act(options?: CommandOptions): Promise<void>;

  /**
   * Interact with the item under the ScreenReader cursor.
   *
   * @param {object} [options] Additional options.
   */
  interact(options?: CommandOptions): Promise<void>;

  /**
   * Stop interacting with the current item.
   *
   * @param {object} [options] Additional options.
   */
  stopInteracting(options?: CommandOptions): Promise<void>;

  /**
   * Press a key on the focused item.
   *
   * `key` can specify the intended [keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
   * value or a single character to generate the text for. A superset of the `key` values can be found
   * [on the MDN key values page](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values). Examples of the keys are:
   *
   * `F1` - `F20`, `Digit0` - `Digit9`, `KeyA` - `KeyZ`, `Backquote`, `Minus`, `Equal`, `Backslash`, `Backspace`, `Tab`,
   * `Delete`, `Escape`, `ArrowDown`, `End`, `Enter`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowRight`, `ArrowUp`, etc.
   *
   * Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`, `Meta`.
   *
   * Holding down `Shift` will type the text that corresponds to the `key` in the upper case.
   *
   * If `key` is a single character, it is case-sensitive, so the values `a` and `A` will generate different respective
   * texts.
   *
   * Shortcuts such as `key: "Control+f"` or `key: "Control+Shift+f"` are supported as well. When specified with the
   * modifier, modifier is pressed and being held while the subsequent key is being pressed.
   *
   * ```ts
   * await keyboard.press("Control+f");
   * ```
   *
   * @param {string} key Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.
   * @param {object} [options] Additional options.
   */
  press(key: string, options?: KeyboardOptions): Promise<void>;

  /**
   * Type text into the focused item.
   *
   * To press a special key, like `Control` or `ArrowDown`, use `keyboard.press(key[, options])`.
   *
   * ```ts
   * await keyboard.type("my-username");
   * await keyboard.press("Enter");
   * ```
   *
   * @param {string} text Text to type into the focused element.
   * @param {object} [options] Additional options.
   */
  type(text: string, options?: KeyboardOptions): Promise<void>;

  /**
   * Perform a ScreenReader command.
   *
   * @param {any} command ScreenReader keyboard command or commander command to execute.
   * @param {object} [options] Additional options.
   */
  perform(command: unknown, options?: CommandOptions): Promise<void>;

  /**
   * Click the mouse.
   *
   * @param {object} [options] Click options.
   */
  click(options?: ClickOptions): Promise<void>;

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
   * @returns {string[]} The spoken phrase log.
   */
  spokenPhraseLog(): string[];

  /**
   * Get the log of all visited item text for this ScreenReader instance.
   *
   * @returns {string[]} The item text log.
   */
  itemTextLog(): string[];
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
