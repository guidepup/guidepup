/**
 * A key code command.
 */
export interface KeyCodeCommand {
  /**
   * The key code or key codes to send.
   */
  keyCode: number | number[];
  /**
   * List of modifier keys to press while sending the key code(s).
   */
  modifiers?: string[];
}
