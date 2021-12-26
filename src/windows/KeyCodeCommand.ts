import type { KeyCodeCommand as KeyCodeCommandBase } from "../KeyCodeCommand";
import type { Modifiers } from "./Modifiers";

/**
 * A Windows key code command.
 */
export interface KeyCodeCommand extends KeyCodeCommandBase {
  /**
   * The key code to send.
   */
  keyCode: string;
  /**
   * List of modifier keys to press while sending the key code(s).
   */
  modifiers?: Modifiers[];
  /**
   * Description of the action the key code performs.
   */
  description?: string;
  /**
   * Symbolic representation of the key code and modifier keys this command
   * uses.
   */
  gesture?: string;
}
