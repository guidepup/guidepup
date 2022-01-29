/**
 * MacOS key codes.
 *
 * Reference: {@link https://eastmanreference.com/complete-list-of-applescript-key-codes}
 */
export enum KeyCodes {
  /**
   * A
   */
  KEY_A = 0,
  /**
   * S
   */
  KEY_S = 1,
  /**
   * D
   */
  KEY_D = 2,
  /**
   * F
   */
  KEY_F = 3,
  /**
   * H
   */
  KEY_H = 4,
  /**
   * G
   */
  KEY_G = 5,
  /**
   * Z
   */
  KEY_Z = 6,
  /**
   * X
   */
  KEY_X = 7,
  /**
   * C
   */
  KEY_C = 8,
  /**
   * V
   */
  KEY_V = 9,
  /**
   * B
   */
  KEY_B = 11,
  /**
   * Q
   */
  KEY_Q = 12,
  /**
   * W
   */
  KEY_W = 13,
  /**
   * E
   */
  KEY_E = 14,
  /**
   * R
   */
  KEY_R = 15,
  /**
   * Y
   */
  KEY_Y = 16,
  /**
   * T
   */
  KEY_T = 17,
  /**
   * 1
   */
  KEY_1 = 18,
  /**
   * 2
   */
  KEY_2 = 19,
  /**
   * 3
   */
  KEY_3 = 20,
  /**
   * 4
   */
  KEY_4 = 21,
  /**
   * 6
   */
  KEY_6 = 22,
  /**
   * 5
   */
  KEY_5 = 23,
  /**
   * =
   */
  KEY_EQUALS = 24,
  /**
   * 9
   */
  KEY_9 = 25,
  /**
   * 7
   */
  KEY_7 = 26,
  /**
   * -
   */
  KEY_DASH = 27,
  /**
   * 8
   */
  KEY_8 = 28,
  /**
   * 0
   */
  KEY_0 = 29,
  /**
   * ]
   */
  KEY_RIGHT_SQUARE_BRACKET = 30,
  /**
   * O
   */
  KEY_O = 31,
  /**
   * U
   */
  KEY_U = 32,
  /**
   * [
   */
  KEY_LEFT_SQUARE_BRACKET = 33,
  /**
   * I
   */
  KEY_I = 34,
  /**
   * P
   */
  KEY_P = 35,
  /**
   * ↵
   */
  KEY_RETURN = 36,
  /**
   * L
   */
  KEY_L = 37,
  /**
   * J
   */
  KEY_J = 38,
  /**
   * '
   */
  KEY_SINGLE_QUOTE = 39,
  /**
   * K
   */
  KEY_K = 40,
  /**
   * ;
   */
  KEY_SEMI_COLON = 41,
  /**
   * \
   */
  KEY_BACK_SLASH = 42,
  /**
   * ,
   */
  KEY_COMMA = 43,
  /**
   * /
   */
  KEY_FORWARD_SLASH = 44,
  /**
   * N
   */
  KEY_N = 45,
  /**
   * M
   */
  KEY_M = 46,
  /**
   * .
   */
  KEY_PERIOD = 47,
  /**
   * ⇥
   */
  KEY_TAB = 48,
  /**
   * " "
   */
  KEY_SPACE_BAR = 49,
  /**
   * `
   */
  KEY_BACK_TICK = 50,
  /**
   * ←
   */
  KEY_DELETE = 51,
  /**
   * esc
   */
  KEY_ESCAPE = 53,
  /**
   * cmd ⌘
   */
  KEY_COMMAND = 55,
  /**
   * ⇧
   */
  KEY_LEFT_SHIFT = 56,
  /**
   * Caps Lock
   */
  KEY_CAPS_LOCK = 57,
  /**
   * ⌥
   */
  KEY_LEFT_OPTION = 58,
  /**
   * ⌃
   */
  KEY_CONTROL = 59,
  /**
   * ⇧
   */
  KEY_RIGHT_SHIFT = 60,
  /**
   * ⌥
   */
  KEY_RIGHT_OPTION = 61,
  /**
   * ⌃
   */
  KEY_CONTROL_RIGHT = 62,
  /**
   * fn
   */
  KEY_FUNCTION = 63,
  /**
   * F17
   */
  KEY_F17 = 64,
  /**
   * .
   */
  KEY_NUMPAD_PERIOD = 65,
  /**
   * *
   */
  KEY_NUMPAD_ASTERISK = 67,
  /**
   * +
   */
  KEY_NUMPAD_PLUS = 69,
  /**
   * *
   */
  KEY_NUMPAD_CLEAR = 71,
  /**
   * /
   */
  KEY_NUMPAD_FORWARD_SLASH = 71,
  /**
   * ⌅
   */
  KEY_ENTER = 76,
  /**
   * -
   */
  KEY_NUMPAD_DASH = 78,
  /**
   * F18
   */
  KEY_F18 = 79,
  /**
   * F19
   */
  KEY_F19 = 80,
  /**
   * =
   */
  KEY_NUMPAD_EQUALS = 81,
  /**
   * 0
   */
  KEY_NUMPAD_0 = 82,
  /**
   * 1
   */
  KEY_NUMPAD_1 = 83,
  /**
   * 0
   */
  KEY_NUMPAD_2 = 84,
  /**
   * 3
   */
  KEY_NUMPAD_3 = 85,
  /**
   * 4
   */
  KEY_NUMPAD_4 = 86,
  /**
   * 5
   */
  KEY_NUMPAD_5 = 87,
  /**
   * 6
   */
  KEY_NUMPAD_6 = 88,
  /**
   * 7
   */
  KEY_NUMPAD_7 = 89,
  /**
   * F20
   */
  KEY_F20 = 90,
  /**
   * 8
   */
  KEY_NUMPAD_8 = 91,
  /**
   * 9
   */
  KEY_NUMPAD_9 = 92,
  /**
   * F5
   */
  KEY_F5 = 96,
  /**
   * F6
   */
  KEY_F6 = 97,
  /**
   * F7
   */
  KEY_F7 = 98,
  /**
   * F3
   */
  KEY_F3 = 99,
  /**
   * F8
   */
  KEY_F8 = 100,
  /**
   * F9
   */
  KEY_F9 = 101,
  /**
   * F11
   */
  KEY_F11 = 103,
  /**
   * F13
   */
  KEY_F13 = 105,
  /**
   * F16
   */
  KEY_F16 = 106,
  /**
   * F14
   */
  KEY_F14 = 107,
  /**
   * F10
   */
  KEY_F10 = 109,
  /**
   * F12
   */
  KEY_F12 = 111,
  /**
   * F15
   */
  KEY_F15 = 113,
  /**
   * Home
   */
  KEY_HOME = 115,
  /**
   * Page Up
   */
  KEY_PAGE_UP = 116,
  /**
   * F4
   */
  KEY_F4 = 118,
  /**
   * End
   */
  KEY_END = 119,
  /**
   * F2
   */
  KEY_F2 = 120,
  /**
   * Page Down
   */
  KEY_PAGE_DOWN = 121,
  /**
   * F1
   */
  KEY_F1 = 122,
  /**
   * ←
   */
  KEY_LEFT_ARROW = 123,
  /**
   * →
   */
  KEY_RIGHT_ARROW = 124,
  /**
   * ↓
   */
  KEY_DOWN_ARROW = 125,
  /**
   * ↑
   */
  KEY_UP_ARROW = 126,
  /**
   * F4
   */
  KEY_F4_ALTERNATIVE = 131,
  /**
   * F3
   */
  KEY_F3_ALTERNATIVE = 160,
}
