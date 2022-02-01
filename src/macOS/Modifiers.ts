/**
 * MacOS modifier keys.
 *
 * Reference: {@link https://eastmanreference.com/complete-list-of-applescript-key-codes}
 */
export enum Modifiers {
  /**
   * Hold down the Command (alias cmd, ⌘) key.
   */
  Command = "command down",
  CommandLeft = "command down",
  CommandRight = "command down",
  Meta = "command down",
  /**
   * Hold down the Control (alias ctrl, ⌃) key.
   */
  Control = "control down",
  ControlLeft = "control down",
  ControlRight = "control down",
  /**
   * Hold down the Option (alias alt, ⌥) key.
   */
  Option = "option down",
  OptionLeft = "option down",
  OptionRight = "option down",
  Alt = "option down",
  AltLeft = "option down",
  AltRight = "option down",
  /**
   * Hold down the Shift (alias ⇧) key.
   */
  Shift = "shift down",
  ShiftLeft = "shift down",
  ShiftRight = "shift down",
}
