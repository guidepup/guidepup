import type { Key } from "./Key";
import type { KeyCodeCommand as KeyCodeCommandBase } from "../KeyCodeCommand";
import { Modifiers } from "./Modifiers";

/**
 * A Windows key code command.
 */
export interface KeyCodeCommand extends KeyCodeCommandBase {
  /**
   * The key code to send.
   */
  keyCode: Key | Key[];
  /**
   * List of modifier keys to press while sending the key code(s).
   */
  modifiers?: (typeof Modifiers)[];
  /**
   * Description of the action the key code performs.
   */
  description?: string;
  /**
   * Symbolic representation of the key code and modifier keys this command
   * uses.
   */
  representation?: string;
}
