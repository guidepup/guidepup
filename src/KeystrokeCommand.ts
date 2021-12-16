/**
 * A keystroke command.
 */
export interface KeystrokeCommand {
  /**
   * The character(s) to send.
   */
  characters: string;
  /**
   * List of modifier keys to press while sending the character(s).
   */
  modifiers?: string[];
}
