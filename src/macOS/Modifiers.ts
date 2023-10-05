/* eslint-disable @typescript-eslint/no-duplicate-enum-values */

/**
 * MacOS modifier keys.
 *
 * Reference: {@link https://eastmanreference.com/complete-list-of-applescript-key-codes}
 */
export enum Modifiers {
  /**
   * The Command (alias cmd, ⌘) key.
   */
  Command = "command",
  CommandLeft = "command",
  CommandRight = "command",
  Meta = "command",
  /**
   * The Control (alias ctrl, ⌃) key.
   */
  Control = "control",
  ControlLeft = "control",
  ControlRight = "control",
  /**
   * The Option (alias alt, ⌥) key.
   */
  Option = "option",
  OptionLeft = "option",
  OptionRight = "option",
  Alt = "option",
  AltLeft = "option",
  AltRight = "option",
  /**
   * The Shift (alias ⇧) key.
   */
  Shift = "shift",
  ShiftLeft = "shift",
  ShiftRight = "shift",
}
