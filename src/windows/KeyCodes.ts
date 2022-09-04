import { Key } from "./Key";

export const KeyCodes = {
  /**
   * A tilde (~)
   */
  KEY_TILDE: new Key({
    scanCode: 43,
    keyCode: 222,
    extended: false,
    symbol: "{~}",
  }),
  /**
   * An exclamation point (!)
   */
  KEY_EXCLAMATION: new Key({
    keyCode: 31,
    scanCode: 2,
    extended: false,
    symbol: "{!}",
  }),
  /**
   * A caret (^)
   */
  KEY_CARET: new Key({
    keyCode: 36,
    scanCode: 7,
    extended: false,
    symbol: "{^}",
  }),
  /**
   * A plus sign (+)
   */
  KEY_PLUS: new Key({
    keyCode: 137,
    scanCode: 13,
    extended: false,
    symbol: "{+}",
  }),
  /**
   * A Backspace keystroke
   */
  KEY_BACKSPACE: new Key({
    keyCode: 8,
    scanCode: 14,
    extended: false,
    symbol: "{BACKSPACE}",
  }),
  /**
   * A Break keystroke
   */
  KEY_BREAK: new Key({ symbol: "{BREAK}" }),
  /**
   * The Caps Lock Key (toggle on or off)
   */
  KEY_CAPS_LOCK: new Key({ symbol: "{CAPSLOCK}" }),
  /**
   * Clear the field
   */
  KEY_CLEAR: new Key({ symbol: "{CLEAR}" }),
  /**
   * A Delete keystroke
   */
  KEY_DELETE: new Key({ symbol: "{DELETE}" }),
  /**
   * An Insert keystroke
   */
  KEY_INSERT: new Key({ symbol: "{INSERT}" }),
  /**
   * A Left arrow (←)
   */
  KEY_LEFT_ARROW: new Key({ symbol: "{LEFT}" }),
  /**
   * A Right arrow (→)
   */
  KEY_RIGHT_ARROW: new Key({ symbol: "{RIGHT}" }),
  /**
   * A Down arrow (↓)
   */
  KEY_DOWN_ARROW: new Key({
    keyCode: 40,
    scanCode: 80,
    extended: true,
    symbol: "{DOWN}",
  }),
  /**
   * A Up arrow (↑)
   */
  KEY_UP_ARROW: new Key({
    keyCode: 38,
    scanCode: 72,
    extended: true,
    symbol: "{UP}",
  }),
  /**
   * An End keystroke
   */
  KEY_END: new Key({
    keyCode: 35,
    scanCode: 79,
    extended: true,
    symbol: "{END}",
  }),
  /**
   * An Enter keystroke
   */
  KEY_ENTER: new Key({
    keyCode: 13,
    scanCode: 28,
    extended: false,
    symbol: "{ENTER}",
  }),
  /**
   * An Esc keystroke
   */
  KEY_ESCAPE: new Key({ symbol: "{ESCAPE}" }),
  /**
   * An F1 Function keystroke
   */
  KEY_F1: new Key({ symbol: "{F1}" }),
  /**
   * An F2 Function keystroke
   */
  KEY_F2: new Key({ symbol: "{F2}" }),
  /**
   * An F3 Function keystroke
   */
  KEY_F3: new Key({ symbol: "{F3}" }),
  /**
   * An F4 Function keystroke
   */
  KEY_F4: new Key({ symbol: "{F4}" }),
  /**
   * An F5 Function keystroke
   */
  KEY_F5: new Key({ symbol: "{F5}" }),
  /**
   * An F6 Function keystroke
   */
  KEY_F6: new Key({ symbol: "{F6}" }),
  /**
   * An F7 Function keystroke
   */
  KEY_F7: new Key({ symbol: "{F7}" }),
  /**
   * An F8 Function keystroke
   */
  KEY_F8: new Key({ symbol: "{F8}" }),
  /**
   * An F9 Function keystroke
   */
  KEY_F9: new Key({ symbol: "{F9}" }),
  /**
   * An F10 Function keystroke
   */
  KEY_F10: new Key({ symbol: "{F10}" }),
  /**
   * An F11 Function keystroke
   */
  KEY_F11: new Key({ symbol: "{F11}" }),
  /**
   * An F12 Function keystroke
   */
  KEY_F12: new Key({ symbol: "{F12}" }),
  /**
   * An F13 Function keystroke
   */
  KEY_F13: new Key({ symbol: "{F13}" }),
  /**
   * An F14 Function keystroke
   */
  KEY_F14: new Key({ symbol: "{F14}" }),
  /**
   * An F15 Function keystroke
   */
  KEY_F15: new Key({ symbol: "{F15}" }),
  /**
   * An F16 Function keystroke
   */
  KEY_F16: new Key({ symbol: "{F16}" }),
  /**
   * A Help keystroke
   */
  KEY_HELP: new Key({ symbol: "{HELP}" }),
  /**
   * A Home keystroke
   */
  KEY_HOME: new Key({ symbol: "{HOME}" }),
  /**
   * A Num Lock keystroke
   */
  KEY_NUMLOCK: new Key({ symbol: "{NUMLOCK}" }),
  /**
   * A Page Down keystroke
   */
  KEY_PAGE_DOWN: new Key({ symbol: "{PGDN}" }),
  /**
   * A Page Up keystroke
   */
  KEY_PAGE_UP: new Key({ symbol: "{PGUP}" }),
  /**
   * A Print Screen keystroke
   */
  KEY_PRINT_SCREEN: new Key({ symbol: "{PRTSC}" }),
  /**
   * The Scroll lock Key (toggle on or off)
   */
  KEY_SCROLL_LOCK: new Key({ symbol: "{SCROLLLOCK}" }),
  /**
   * A TAB keystroke
   */
  KEY_TAB: new Key({ symbol: "{TAB}" }),
};
