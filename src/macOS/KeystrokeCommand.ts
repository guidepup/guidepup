import type { KeystrokeCommand as KeystrokeCommandBase } from "../KeystrokeCommand";
import type { Modifiers } from "./Modifiers";

/**
 * A MacOS keystroke command.
 */
export interface KeystrokeCommand extends KeystrokeCommandBase {
  /**
   * List of modifier keys to press while sending the character(s).
   */
  modifiers?: Modifiers[];
  /**
   * Description of the action the keypress performs.
   */
  description?: string;
  /**
   * Symbolic representation of the characters and modifier keys this command
   * uses.
   */
  gesture?: string;
}
