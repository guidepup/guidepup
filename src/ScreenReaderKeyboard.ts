import type { CommandOptions } from "./CommandOptions";
import type { KeyboardCommand } from "./KeyboardCommand";
import type { KeyboardOptions } from "./KeyboardOptions";

export interface ScreenReaderKeyboard {
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
   * ScreenReader keyboard commands.
   */
  get commands(): Record<string, KeyboardCommand>;

  /**
   * Perform a ScreenReader keyboard command.
   *
   * @param {object} command ScreenReader keyboard command to execute.
   * @param {object} [options] Additional options.
   */
  perform(command: KeyboardCommand, options?: CommandOptions): Promise<void>;
}
