/**
 * macOS key codes.
 *
 * references:
 * - {@link https://eastmanreference.com/complete-list-of-applescript-key-codes}
 * - {@link http://macbiblioblog.blogspot.com/2014/12/key-codes-for-function-and-special-keys.html}
 */

export enum KeyCodes {
  /**
   * a
   */
  a = 0,
  A = 0,
  KeyA = 0,
  /**
   * s
   */
  s = 1,
  S = 1,
  KeyS = 1,
  /**
   * d
   */
  d = 2,
  D = 2,
  KeyD = 2,
  /**
   * f
   */
  f = 3,
  F = 3,
  KeyF = 3,
  /**
   * h
   */
  h = 4,
  H = 4,
  KeyH = 4,
  /**
   * g
   */
  g = 5,
  G = 5,
  KeyG = 5,
  /**
   * z
   */
  z = 6,
  Z = 6,
  KeyZ = 6,
  /**
   * x
   */
  x = 7,
  X = 7,
  KeyX = 7,
  /**
   * c
   */
  c = 8,
  C = 8,
  KeyC = 8,
  /**
   * v
   */
  v = 9,
  V = 9,
  KeyV = 9,
  /**
   * §
   */
  SectionSign = 10,
  /**
   * b
   */
  b = 11,
  B = 11,
  KeyB = 11,
  /**
   * q
   */
  q = 12,
  Q = 12,
  KeyQ = 12,
  /**
   * w
   */
  w = 13,
  W = 13,
  KeyW = 13,
  /**
   * e
   */
  e = 14,
  E = 14,
  KeyE = 14,
  /**
   * r
   */
  r = 15,
  R = 15,
  KeyR = 15,
  /**
   * y
   */
  y = 16,
  Y = 16,
  KeyY = 16,
  /**
   * t
   */
  t = 17,
  T = 17,
  KeyT = 17,
  /**
   * 1
   */
  Digit1 = 18,
  /**
   * 2
   */
  Digit2 = 19,
  /**
   * 3
   */
  Digit3 = 20,
  /**
   * 4
   */
  Digit4 = 21,
  /**
   * 6
   */
  Digit6 = 22,
  /**
   * 5
   */
  Digit5 = 23,
  /**
   * =
   */
  "=" = 24,
  Equals = 24,
  /**
   * 9
   */
  Digit9 = 25,
  /**
   * 7
   */
  Digit7 = 26,
  /**
   * -
   */
  "-" = 27,
  Dash = 27,
  Minus = 27,
  /**
   * 8
   */
  Digit8 = 28,
  /**
   * 0
   */
  Digit0 = 29,
  /**
   * ]
   */
  "]" = 30,
  RightSquareBracket = 30,
  /**
   * o
   */
  o = 31,
  O = 31,
  KeyO = 31,
  /**
   * u
   */
  u = 32,
  U = 32,
  KeyU = 32,
  /**
   * [
   */
  "[" = 33,
  LeftSquareBracket = 33,
  /**
   * i
   */
  i = 34,
  I = 34,
  KeyI = 34,
  /**
   * p
   */
  p = 35,
  P = 35,
  KeyP = 35,
  /**
   * Return ↵
   *
   * This is actually the "Return" key for MacOS.
   */
  Enter = 36,
  Return = 36,
  /**
   * l
   */
  l = 37,
  L = 37,
  KeyL = 37,
  /**
   * j
   */
  j = 38,
  J = 38,
  KeyJ = 38,
  /**
   * '
   */
  "'" = 39,
  SingleQuote = 39,
  /**
   * k
   */
  k = 40,
  K = 40,
  KeyK = 40,
  /**
   * ;
   */
  ";" = 41,
  SemiColon = 41,
  /**
   * \
   */
  "\\" = 42,
  Backslash = 42,
  /**
   * ,
   */
  "," = 43,
  Comma = 43,
  /**
   * /
   */
  "/" = 44,
  ForwardSlash = 44,
  /**
   * n
   */
  n = 45,
  N = 45,
  KeyN = 45,
  /**
   * m
   */
  m = 46,
  M = 46,
  KeyM = 46,
  /**
   * .
   */
  "." = 47,
  Period = 47,
  FullStop = 47,
  /**
   * Tab ⇥
   */
  Tab = 48,
  /**
   * " "
   */
  " " = 49,
  Space = 49,
  Spacebar = 49,
  /**
   * `
   */
  "`" = 50,
  Backtick = 50,
  Tilde = 50,
  /**
   * Backspace ← / ⌫
   *
   * Labelled as Delete on Mac keyboards, this is actually
   * a Backspace key.
   */
  Backspace = 51,
  // Delete = 51,
  /**
   * Line Feed ␊
   */
  LineFeed = 52,
  /**
   * Escape ⎋
   */
  Escape = 53,
  /**
   * Command ⌘
   */
  Command = 55,
  CommandLeft = 55,
  CommandRight = 55,
  Meta = 55,
  /**
   * ⇧
   */
  Shift = 56,
  ShiftLeft = 56,
  /**
   * Caps Lock ⇪
   */
  CapsLock = 57,
  /**
   * ⌥
   */
  Option = 58,
  OptionLeft = 58,
  Alt = 58,
  AltLeft = 58,
  /**
   * ⌃
   */
  Control = 59,
  ControlLeft = 59,
  /**
   * ⇧
   */
  ShiftRight = 60,
  /**
   * ⌥
   */
  OptionRight = 61,
  AltRight = 61,
  /**
   * ⌃
   */
  ControlRight = 62,
  /**
   * fn
   */
  Fn = 63,
  /**
   * F17
   */
  F17 = 64,
  /**
   * NumPad .
   */
  Decimal = 65,
  /**
   * NumPad *
   */
  Multiply = 67,
  /**
   * NumPad +
   */
  Add = 69,
  Plus = 69,
  /**
   * NumPad Clear ⌧
   */
  Clear = 71,
  /**
   * Volume Up
   */
  VolumeUp = 72,
  /**
   * Volume Down
   */
  VolumeDown = 73,
  /**
   * Mute
   */
  Mute = 74,
  /**
   * NumPad /
   */
  Divide = 75,
  /**
   * ⌅
   *
   * Not used.
   */
  // Enter = 76,
  /**
   * NumPad -
   */
  Subtract = 78,
  /**
   * F18
   */
  F18 = 79,
  /**
   * F19
   */
  F19 = 80,
  /**
   * NumPad =
   *
   * Not used.
   */
  // Equals = 81,
  /**
   * NumPad 0
   *
   * Not used.
   */
  // Digit0 = 82,
  /**
   * NumPad 1
   *
   * Not used.
   */
  // Digit1 = 83,
  /**
   * NumPad 2
   *
   * Not used.
   */
  // Digit2 = 84,
  /**
   * NumPad 3
   *
   * Not used.
   */
  // Digit3 = 85,
  /**
   * NumPad 4
   *
   * Not used.
   */
  // Digit4 = 86,
  /**
   * NumPad 5
   *
   * Not used.
   */
  // Digit5 = 87,
  /**
   * NumPad 6
   *
   * Not used.
   */
  // Digit6 = 88,
  /**
   * NumPad 7
   *
   * Not used.
   */
  // Digit7 = 89,
  /**
   * F20
   */
  F20 = 90,
  /**
   * NumPad 8
   *
   * Not used.
   */
  // Digit8 = 91,
  /**
   * NumPad 9
   *
   * Not used.
   */
  // Digit9 = 92,
  /**
   * F5
   */
  F5 = 96,
  /**
   * F6
   */
  F6 = 97,
  /**
   * F7
   */
  F7 = 98,
  /**
   * F3
   */
  F3 = 99,
  /**
   * F8
   */
  F8 = 100,
  /**
   * F9
   */
  F9 = 101,
  /**
   * F11
   */
  F11 = 103,
  /**
   * F13
   */
  F13 = 105,
  /**
   * F16
   */
  F16 = 106,
  /**
   * F14
   */
  F14 = 107,
  /**
   * F10
   */
  F10 = 109,
  /**
   * F12
   */
  F12 = 111,
  /**
   * F15
   */
  F15 = 113,
  /**
   * Help / Insert
   */
  Help = 114,
  Insert = 114,
  /**
   * Home
   */
  Home = 115,
  /**
   * Page Up
   */
  PageUp = 116,
  /**
   * Forward Delete ⌦
   */
  ForwardDelete = 117,
  Delete = 117,
  /**
   * F4
   */
  F4 = 118,
  /**
   * end
   */
  End = 119,
  /**
   * F2
   */
  F2 = 120,
  /**
   * Page Down
   */
  PageDown = 121,
  /**
   * F1
   */
  F1 = 122,
  /**
   * ←
   */
  Left = 123,
  ArrowLeft = 123,
  /**
   * →
   */
  Right = 124,
  ArrowRight = 124,
  /**
   * ↓
   */
  Down = 125,
  ArrowDown = 125,
  /**
   * ↑
   */
  Up = 126,
  ArrowUp = 126,
  /**
   * F4
   *
   * Not used.
   */
  // F4 = 131,
  /**
   * F3
   *
   * Not used.
   */
  // F3 = 160,
}
