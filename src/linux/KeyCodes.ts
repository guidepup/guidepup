/**
 * X11 keysyms for keys that can be pressed with real keyboard input on Linux,
 * named to match the Windows and macOS key codes so `press()` accepts the same
 * keys everywhere.
 *
 * REF: https://gitlab.freedesktop.org/xorg/proto/xorgproto/-/blob/master/include/X11/keysymdef.h
 */

const letters = Object.fromEntries(
  "abcdefghijklmnopqrstuvwxyz".split("").flatMap((letter) => {
    // Latin keysyms match their lowercase code points; Shift gives uppercase.
    const keysym = letter.charCodeAt(0);

    return [
      [letter, keysym],
      [letter.toUpperCase(), keysym],
      [`Key${letter.toUpperCase()}`, keysym],
    ];
  }),
);

const digits = Object.fromEntries(
  "0123456789".split("").map((digit) => [`Digit${digit}`, digit.charCodeAt(0)]),
);

const functionKeys = Object.fromEntries(
  Array.from({ length: 12 }, (_, index) => [`F${index + 1}`, 0xffbe + index]),
);

export const KeyCodes: Record<string, number> = {
  ...letters,
  ...digits,
  ...functionKeys,
  Escape: 0xff1b,
  Tab: 0xff09,
  Enter: 0xff0d,
  Backspace: 0xff08,
  Delete: 0xffff,
  ForwardDelete: 0xffff,
  Insert: 0xff63,
  Home: 0xff50,
  End: 0xff57,
  PageUp: 0xff55,
  PageDown: 0xff56,
  ArrowLeft: 0xff51,
  Left: 0xff51,
  ArrowUp: 0xff52,
  Up: 0xff52,
  ArrowRight: 0xff53,
  Right: 0xff53,
  ArrowDown: 0xff54,
  Down: 0xff54,
  Space: 0x20,
  Spacebar: 0x20,
  Comma: 0x2c,
  Period: 0x2e,
  FullStop: 0x2e,
  Minus: 0x2d,
  Dash: 0x2d,
  Equals: 0x3d,
  Backslash: 0x5c,
  LeftSquareBracket: 0x5b,
  RightSquareBracket: 0x5d,
  SingleQuote: 0x27,
  Backtick: 0x60,
  ",": 0x2c,
  ".": 0x2e,
  "-": 0x2d,
  "=": 0x3d,
  "\\": 0x5c,
  "[": 0x5b,
  "]": 0x5d,
  "'": 0x27,
  "`": 0x60,
};
