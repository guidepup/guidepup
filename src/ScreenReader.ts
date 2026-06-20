import type { ClickOptions } from "./ClickOptions";
import type { CommandOptions } from "./CommandOptions";
import { ERR_NO_AVAILABLE_SUPPORTED_SCREEN_READERS } from "./errors";
import type { IScreenReader } from "./IScreenReader";
import { KeyboardOptions } from "./KeyboardOptions";
import { nvda } from "./windows";
import { voiceOver } from "./macOS";

export class ScreenReader implements IScreenReader {
  private implementation: IScreenReader;

  constructor() {
    this.implementation = this.resolveImplementation();
  }

  private resolveImplementation(): IScreenReader {
    if (voiceOver.default()) {
      return voiceOver;
    }

    if (nvda.default()) {
      return nvda;
    }

    throw new Error(ERR_NO_AVAILABLE_SUPPORTED_SCREEN_READERS);
  }

  /**
   * The screen reader name.
   */
  get name(): string {
    return this.implementation.name;
  }

  /**
   * Detect whether the screen reader is supported for the current OS.
   *
   * @returns {Promise<boolean>}
   */
  detect(): Promise<boolean> {
    return this.implementation.detect();
  }

  /**
   * Detect whether the screen reader is the default screen reader for the current OS.
   *
   * @returns {boolean}
   */
  default(): boolean {
    return this.implementation.default();
  }

  /**
   * Turn the screen reader on.
   *
   * @param {object} [options] Additional options.
   */
  start(options?: CommandOptions): Promise<void> {
    return this.implementation.start(options);
  }

  /**
   * Turn the screen reader off.
   *
   * @param {object} [options] Additional options.
   */
  stop(options?: CommandOptions): Promise<void> {
    return this.implementation.stop(options);
  }

  /**
   * Move the screen reader cursor to the previous location.
   *
   * @param {object} [options] Additional options.
   */
  previous(options?: CommandOptions): Promise<void> {
    return this.implementation.previous(options);
  }

  /**
   * Move the screen reader cursor to the next location.
   *
   * @param {object} [options] Additional options.
   */
  next(options?: CommandOptions): Promise<void> {
    return this.implementation.next(options);
  }

  /**
   * Perform the default action for the item in the screen reader cursor.
   *
   * @param {object} [options] Additional options.
   */
  act(options?: CommandOptions): Promise<void> {
    return this.implementation.act(options);
  }

  /**
   * Interact with the item under the screen reader cursor.
   *
   * @param {object} [options] Additional options.
   */
  interact(options?: CommandOptions): Promise<void> {
    return this.implementation.interact(options);
  }

  /**
   * Stop interacting with the current item.
   *
   * @param {object} [options] Additional options.
   */
  stopInteracting(options?: CommandOptions): Promise<void> {
    return this.implementation.stopInteracting(options);
  }

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
  press(key: string, options?: KeyboardOptions): Promise<void> {
    return this.implementation.press(key, options);
  }

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
   * @param {string} text Text to type into the focused item.
   * @param {object} [options] Additional options.
   */
  type(text: string, options?: KeyboardOptions): Promise<void> {
    return this.implementation.type(text, options);
  }

  /**
   * Perform a screen reader command.
   *
   * @param {any} command Screen reader keyboard command or commander command to execute.
   * @param {object} [options] Additional options.
   */
  perform(command: unknown, options?: CommandOptions): Promise<void> {
    return this.implementation.perform(command, options);
  }

  /**
   * Click the mouse.
   *
   * @param {object} [options] Click options.
   */
  click(options?: ClickOptions): Promise<void> {
    return this.implementation.click(options);
  }

  /**
   * Get the last spoken phrase.
   *
   * @returns {Promise<string>} The last spoken phrase.
   */
  lastSpokenPhrase(): Promise<string> {
    return this.implementation.lastSpokenPhrase();
  }

  /**
   * Get the text of the item in the screen reader cursor.
   *
   * @returns {Promise<string>} The item's text.
   */
  itemText(): Promise<string> {
    return this.implementation.itemText();
  }

  /**
   * Get the log of all spoken phrases for this screen reader instance.
   *
   * @returns {Promise<string[]>} The spoken phrase log.
   */
  spokenPhraseLog(): Promise<string[]> {
    return this.implementation.spokenPhraseLog();
  }

  /**
   * Clear the log of all spoken phrases for this screen reader instance.
   */
  clearSpokenPhraseLog(): Promise<void> {
    return this.implementation.clearSpokenPhraseLog();
  }

  /**
   * Get the log of all visited item text for this screen reader instance.
   *
   * @returns {Promise<string[]>} The item text log.
   */
  itemTextLog(): Promise<string[]> {
    return this.implementation.itemTextLog();
  }

  /**
   * Clear the log of all visited item text for this screen reader instance.
   */
  clearItemTextLog(): Promise<void> {
    return this.implementation.clearItemTextLog();
  }
}
