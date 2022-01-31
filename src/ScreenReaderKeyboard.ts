import type { CommandOptions } from "./CommandOptions";
import type { KeyboardCommand } from "./KeyboardCommand";
import type { KeyboardOptions } from "./KeyboardOptions";

export interface ScreenReaderKeyboard {
  /**
   * Press a key on the focused element.
   *
   * @param {string} key Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.
   */
  press(key: string, options?: KeyboardOptions): Promise<void>;

  /**
   * Type into the focused item.
   *
   * @param {string} text Text to type into the focused element.
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
   */
  perform(command: KeyboardCommand, options?: CommandOptions): Promise<void>;
}
