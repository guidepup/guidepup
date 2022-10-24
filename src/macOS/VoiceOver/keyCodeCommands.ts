// REF: https://www.apple.com/voiceover/info/guide/_1131.html

import { KeyCodes } from "../KeyCodes";
import { Modifiers } from "../Modifiers";

const VO = [Modifiers.Control, Modifiers.Option];

/**
 * Object of key code commands for the VoiceOver ScreenReader on MacOS.
 *
 * Reference: {@link https://www.apple.com/voiceover/info/guide/_1131.html}
 */
export const keyCodeCommands = {
  start: {
    keyCode: KeyCodes.F5,
    modifiers: [Modifiers.Command],
    description: "Start VoiceOver",
    representation: "Command-F5",
  },
  quit: {
    keyCode: KeyCodes.F5,
    modifiers: [Modifiers.Command],
    description: "Quit VoiceOver",
    representation: "Command-F5",
  },

  // General Commands

  toggleLock: {
    keyCode: KeyCodes.SemiColon,
    modifiers: VO,
    description: "Lock and unlock the VO (Control and Option) keys",
    representation: "VO-;",
  },
  openVoiceOverUtility: {
    keyCode: KeyCodes.F8,
    modifiers: VO,
    description: "Open VoiceOver Utility",
    representation: "VO-F8",
  },
  openVoiceOverHelpMenu: {
    keyCode: KeyCodes.H,
    modifiers: VO,
    description: "Open the VoiceOver Help menu",
    representation: "VO-H",
  },
  openVoiceOverQuickStart: {
    keyCode: KeyCodes.F8,
    modifiers: [...VO, Modifiers.Command],
    description: "Open the VoiceOver Quick Start",
    representation: "VO-Command-F8",
  },
  openVoiceOverOnlineHelp: {
    keyCode: KeyCodes.ForwardSlash,
    modifiers: [...VO, Modifiers.Shift],
    description: "Open VoiceOver online help",
    representation: "VO-Shift-/",
  },
  startKeyboardHelp: {
    keyCode: KeyCodes.k,
    modifiers: VO,
    description: "Start keyboard help",
    representation: "VO-K",
  },
  hearItemDescription: {
    keyCode: KeyCodes.n,
    modifiers: [...VO, Modifiers.Shift],
    description: "Hear a description of the item in the VoiceOver cursor",
    representation: "VO-Shift-N",
  },
  openCommandsMenu: {
    keyCode: [KeyCodes.h, KeyCodes.h],
    modifiers: VO,
    description: "Open the Commands menu",
    representation: "VO-H-H",
  },
  openFindMenu: {
    keyCode: KeyCodes.f,
    modifiers: [...VO, Modifiers.Shift],
    description: "Open the Find menu",
    representation: "VO-Shift-F",
  },
  stopAction: {
    keyCode: KeyCodes.Escape,
    description: "Close a menu or rotor, stop an action, or exit a mode",
    representation: "Escape",
  },
  ignoreNextKeyCombination: {
    keyCode: KeyCodes.Tab,
    modifiers: VO,
    description: "Tell VoiceOver to ignore the next key combination you press",
    representation: "VO-Tab",
  },
  openVerbosityRotor: {
    keyCode: KeyCodes.v,
    modifiers: VO,
    description: "Open the verbosity rotor",
    representation: "VO-V",
  },
  magnifyItem: {
    keyCode: KeyCodes.RightSquareBracket,
    modifiers: [...VO, Modifiers.Shift],
    description: "Magnify the item in the VoiceOver cursor",
    representation: "VO-}",
  },
  shrinkItem: {
    keyCode: KeyCodes.LeftSquareBracket,
    modifiers: [...VO, Modifiers.Shift],
    description: "Shrink the item in the VoiceOver cursor",
    representation: "VO-{",
  },
  toggleVoiceOverCursorAndPanels: {
    keyCode: KeyCodes.F11,
    modifiers: VO,
    description:
      "Temporarily hide or show the VoiceOver cursor and the caption or braille panels",
    representation: "VO-F11",
  },
  toggleCaptionPanel: {
    keyCode: KeyCodes.F10,
    modifiers: [...VO, Modifiers.Command],
    description: "Hide or show the caption panel only",
    representation: "VO-Command-F10",
  },
  resizeOrMoveCaptionPanel: {
    keyCode: KeyCodes.F10,
    modifiers: [...VO, Modifiers.Shift],
    description: "Resize or move the caption panel",
    representation: "VO-Shift-F10",
  },
  toggleBraillePanel: {
    keyCode: KeyCodes.F9,
    modifiers: [...VO, Modifiers.Command],
    description: "Hide or show the braille panel only",
    representation: "VO-Command-F9",
  },
  resizeOrMoveBraillePanel: {
    keyCode: KeyCodes.F9,
    modifiers: [...VO, Modifiers.Shift],
    description: "Resize or move the braille panel",
    representation: "VO-Shift-F9",
  },
  tileVisuals: {
    keyCode: KeyCodes.F10,
    modifiers: VO,
    description:
      "Tile visuals (dim the screen, highlight the caption or braille panel, and show the item in the VoiceOver cursor in the center of the screen).",
    representation: "VO-F10",
  },
  toggleKeyboardCommander: {
    keyCode: KeyCodes.k,
    modifiers: [...VO, Modifiers.Shift],
    description: "Enable or disable the Keyboard Commander",
    representation: "VO-Shift-K",
  },
  toggleScreenCurtain: {
    keyCode: KeyCodes.F11,
    modifiers: [...VO, Modifiers.Shift],
    description: "Turn the screen black (screen curtain)",
    representation: "VO-Shift-F11",
  },
  cycleRightThroughSpeechSettings: {
    // VoiceOver documentation incorrect
    keyCode: KeyCodes.ArrowRight,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description:
      "Cycle through speech settings (rate, pitch, volume, intonation, voice)",
    representation: "VO-Command-Shift-Right Arrow",
  },
  cycleLeftThroughSpeechSettings: {
    // VoiceOver documentation incorrect
    keyCode: KeyCodes.ArrowLeft,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description:
      "Cycle through speech settings (rate, pitch, volume, intonation, voice)",
    representation: "VO-Command-Shift-Left Arrow",
  },
  changeUpCurrentSpeechSettings: {
    // VoiceOver documentation incorrect
    keyCode: KeyCodes.ArrowUp,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description:
      "Change the current speech setting (rate, pitch, volume, intonation, voice)",
    representation: "VO-Command-Shift-Up Arrow",
  },
  changeDownCurrentSpeechSettings: {
    // VoiceOver documentation incorrect
    keyCode: KeyCodes.ArrowDown,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description:
      "Change the current speech setting (rate, pitch, volume, intonation, voice)",
    representation: "VO-Command-Shift-Down Arrow",
  },
  pressAndReleaseMouse: {
    keyCode: KeyCodes.Space,
    modifiers: [...VO, Modifiers.Shift],
    description: "Press and release mouse button",
    representation: "VO-Shift-Space bar",
  },

  // Interaction Commands

  interactWithItem: {
    keyCode: KeyCodes.ArrowDown,
    modifiers: [...VO, Modifiers.Shift],
    description: "Interact with an item",
    representation: "VO-Shift-Down Arrow",
  },
  stopInteractingWithItem: {
    keyCode: KeyCodes.ArrowUp,
    modifiers: [...VO, Modifiers.Shift],
    description: "Stop interacting with an item",
    representation: "VO-Shift-Up Arrow",
  },
  performDefaultActionForItem: {
    keyCode: KeyCodes.Space,
    modifiers: VO,
    description:
      "Perform the default action for the item in the VoiceOver cursor",
    representation: "VO-Space bar",
  },
  selectItem: {
    keyCode: KeyCodes.Return,
    modifiers: VO,
    description: "Select a menu or list item",
    representation: "VO-Return",
  },
  selectMultipleItems: {
    keyCode: KeyCodes.Space,
    modifiers: [...VO, Modifiers.Command],
    description: "Select multiple items",
    representation: "VO-Command-Space bar",
  },
  toggleStickyMouse: {
    keyCode: KeyCodes.Space,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description:
      "Perform a sticky mouse down or mouse up (for use when dragging an item from one location to drop in another location)",
    representation: "VO-Command-Shift-Space bar",
  },
  doubleClick: {
    keyCode: [KeyCodes.Space, KeyCodes.Space],
    modifiers: [...VO, Modifiers.Shift],
    description: "Click the item under the mouse cursor",
    representation: "VO-Shift-Space bar-Space bar",
  },
  toggleDisclosureTriangle: {
    keyCode: KeyCodes.Backslash,
    modifiers: VO,
    description: "Open or close a disclosure triangle",
    representation: "VO-\\",
  },
  readTableRow: {
    keyCode: KeyCodes.r,
    modifiers: VO,
    description: "Read a row in a table",
    representation: "VO-R",
  },
  readTableColumn: {
    keyCode: [KeyCodes.c, KeyCodes.c],
    modifiers: VO,
    description: "Read a column in a table",
    representation: "VO-C-C",
  },
  readTableColumnHeader: {
    keyCode: KeyCodes.c,
    modifiers: VO,
    description: "Read the column header in a table",
    representation: "VO-C",
  },
  readTableRowAndColumnNumbers: {
    keyCode: KeyCodes.t,
    modifiers: [...VO, Modifiers.Shift],
    description: "Read row and column numbers in a table",
    representation: "VO-Shift-T",
  },
  sortTableColumn: {
    keyCode: KeyCodes.Backslash,
    modifiers: [...VO, Modifiers.Shift],
    description: "Sort a column in a table",
    representation: "VO-|",
  },
  interactWithScrollbars: {
    keyCode: KeyCodes.s,
    modifiers: [...VO, Modifiers.Shift],
    description: "Interact with scroll bars",
    representation: "VO-Shift-S",
  },
  resizeObject: {
    keyCode: KeyCodes.Backtick,
    modifiers: [...VO, Modifiers.Shift],
    description: "Resize a window or an object",
    representation: "VO-~",
  },
  moveObject: {
    keyCode: KeyCodes.Backtick,
    modifiers: VO,
    description: "Move a window or an object",
    representation: "VO-`",
  },

  // Navigation Commands

  moveUp: {
    keyCode: KeyCodes.ArrowUp,
    modifiers: VO,
    description: "Move up",
    representation: "VO-Up Arrow",
  },
  moveDown: {
    keyCode: KeyCodes.ArrowDown,
    modifiers: VO,
    description: "Move down",
    representation: "VO-Down Arrow",
  },
  moveToPrevious: {
    keyCode: KeyCodes.ArrowLeft,
    modifiers: VO,
    description: "Move to previous",
    representation: "VO-Left Arrow",
  },
  moveToNext: {
    keyCode: KeyCodes.ArrowRight,
    modifiers: VO,
    description: "Move to next",
    representation: "VO-Right Arrow",
  },
  moveToVisibleAreaTop: {
    keyCode: KeyCodes.Home,
    modifiers: VO,
    description:
      "Move to the top of the visible area (such as a window or text area) where the VoiceOver cursor is located",
    representation: "VO-Home",
  },
  moveToVisibleAreaBottom: {
    keyCode: KeyCodes.End,
    modifiers: VO,
    description:
      "Move to the bottom of the visible area (such as a window or text area) where the VoiceOver cursor is located",
    representation: "VO-End",
  },
  moveToAreaTop: {
    keyCode: KeyCodes.Home,
    modifiers: [...VO, Modifiers.Shift],
    description:
      "Move to the top of the area (such as a window or text area) where the VoiceOver cursor is located, scrolling if necessary",
    representation: "VO-Shift-Home",
  },
  moveToAreaBottom: {
    keyCode: KeyCodes.End,
    modifiers: [...VO, Modifiers.Shift],
    description:
      "Move to the bottom of the area (such as a window or text area) where the VoiceOver cursor is located, scrolling if necessary",
    representation: "VO-Shift-End",
  },
  moveToFirst: {
    keyCode: KeyCodes.Home,
    modifiers: [...VO, Modifiers.Command],
    description:
      "Move to the top of a window, the first item in the Dock, or the first item on your desktop, depending on your location",
    representation: "VO-Command-Home",
  },
  moveToLast: {
    keyCode: KeyCodes.End,
    modifiers: [...VO, Modifiers.Command],
    description:
      "Move to the lower-right corner of a window, the last item in the Dock, or the last item on your desktop, depending on your location",
    representation: "VO-Command-End",
  },
  moveToFrontWindow: {
    keyCode: KeyCodes.F2,
    modifiers: [...VO, Modifiers.Shift],
    description:
      "Move to the front the window where the VoiceOver cursor is located and make it active",
    representation: "VO-Shift-F2",
  },
  closeWindow: {
    keyCode: KeyCodes.F2,
    modifiers: [...VO, Modifiers.Command],
    description: "Close the window where the VoiceOver cursor is located",
    representation: "VO-Command-F2",
  },
  openItemChooser: {
    keyCode: KeyCodes.i,
    modifiers: VO,
    description: "Open the Item Chooser",
    representation: "VO-I",
  },
  moveToDock: {
    keyCode: KeyCodes.d,
    modifiers: VO,
    description: "Move to the desktop",
    representation: "VO-D",
  },
  moveToDesktop: {
    keyCode: KeyCodes.d,
    modifiers: [...VO, Modifiers.Shift],
    description: "Move to the desktop",
    representation: "VO-D",
  },
  moveToMenuBar: {
    keyCode: KeyCodes.m,
    modifiers: VO,
    description: "Move to the menu bar",
    representation: "VO-M",
  },
  moveToFirstStatusMenuInMenuBar: {
    keyCode: [KeyCodes.m, KeyCodes.m],
    modifiers: VO,
    description: "Move to the first status menu in the menu bar",
    representation: "VO-M-M",
  },
  openSpotlightMenu: {
    keyCode: [KeyCodes.m, KeyCodes.m, KeyCodes.m],
    modifiers: VO,
    description: "Open the Spotlight menu",
    representation: "VO-M-M-M",
  },
  openShortcutMenu: {
    keyCode: KeyCodes.m,
    modifiers: [...VO, Modifiers.Shift],
    description: "Open a shortcut menu",
    representation: "VO-Shift-J",
  },
  jumpToLinkedItem: {
    keyCode: KeyCodes.j,
    modifiers: VO,
    description:
      "Jump to a linked item (for example, from a Mail message in the Inbox to its message text)",
    representation: "VO-J",
  },
  toggleCursorTrackingOptions: {
    keyCode: KeyCodes.F3,
    modifiers: [...VO, Modifiers.Shift],
    description:
      "Temporarily disable or enable the cursor tracking options you selected in VoiceOver Utility. The command doesn't change the settings in VoiceOver Utility.",
    representation: "VO-Shift-F3",
  },
  moveCursorToKeyboardFocus: {
    keyCode: KeyCodes.F4,
    modifiers: [...VO, Modifiers.Shift],
    description: "Move VoiceOver cursor to keyboard focus",
    representation: "VO-Shift-F4",
  },
  moveKeyboardFocusToCursor: {
    keyCode: KeyCodes.F4,
    modifiers: [...VO, Modifiers.Command],
    description: "Move keyboard focus to VoiceOver cursor",
    representation: "VO-Command-F4",
  },
  moveCursorToMouseFocus: {
    keyCode: KeyCodes.F5,
    modifiers: [...VO, Modifiers.Shift],
    description: "Move VoiceOver cursor to mouse cursor",
    representation: "VO-Shift-F5",
  },
  moveMouseFocusToCursor: {
    keyCode: KeyCodes.F5,
    modifiers: [...VO, Modifiers.Command],
    description: "Move mouse cursor to VoiceOver cursor",
    representation: "VO-Command-F5",
  },
  jumpCommand: {
    keyCode: KeyCodes.j,
    modifiers: [...VO, Modifiers.Shift],
    description: "Jump command",
    representation: "VO-Shift-J",
  },
  jumpToTopEdge: {
    keyCode: KeyCodes.ArrowUp,
    modifiers: [...VO, Modifiers.Shift],
    description: "Jump to the top edge of an area. Used with jump command",
    representation: "VO-Shift-Up Arrow",
  },
  jumpToRightEdge: {
    keyCode: KeyCodes.ArrowRight,
    modifiers: [...VO, Modifiers.Shift],
    description: "Jump to the right edge of an area. Used with jump command",
    representation: "VO-Shift-Right Arrow",
  },
  jumpToBottomEdge: {
    keyCode: KeyCodes.ArrowDown,
    modifiers: [...VO, Modifiers.Shift],
    description: "Jump to the bottom edge of an area. Used with jump command",
    representation: "VO-Shift-Down Arrow",
  },
  jumpToLeftEdge: {
    keyCode: KeyCodes.ArrowLeft,
    modifiers: [...VO, Modifiers.Shift],
    description: "Jump to the left edge of an area. Used with jump command",
    representation: "VO-Shift-Left Arrow",
  },
  jumpToTopVisibleEdge: {
    keyCode: KeyCodes.ArrowUp,
    modifiers: VO,
    description:
      "Jump to the top visible edge of an area. Used with jump command",
    representation: "VO-Up Arrow",
  },
  jumpToRightVisibleEdge: {
    keyCode: KeyCodes.ArrowRight,
    modifiers: VO,
    description:
      "Jump to the right visible edge of an area. Used with jump command",
    representation: "VO-Right Arrow",
  },
  jumpToBottomVisibleEdge: {
    keyCode: KeyCodes.ArrowDown,
    modifiers: VO,
    description:
      "Jump to the bottom visible edge of an area. Used with jump command",
    representation: "VO-Down Arrow",
  },
  jumpToLeftVisibleEdge: {
    keyCode: KeyCodes.ArrowLeft,
    modifiers: VO,
    description:
      "Jump to the left visible edge of an area. Used with jump command",
    representation: "VO-Left Arrow",
  },
  jumpBeforeSplitter: {
    keyCode: KeyCodes.LeftSquareBracket,
    modifiers: VO,
    description:
      "Jump to the area that precedes a horizontal or vertical splitter",
    representation: "VO-[",
  },
  jumpAfterSplitter: {
    keyCode: KeyCodes.RightSquareBracket,
    modifiers: VO,
    description:
      "Jump to the area that follows a horizontal or vertical splitter",
    representation: "VO-]",
  },
  findText: {
    keyCode: KeyCodes.f,
    modifiers: VO,
    description: "Find text",
    representation: "VO-F",
  },
  navigateUp: {
    // VoiceOver documentation incorrect
    keyCode: KeyCodes.ArrowUp,
    modifiers: [...VO, Modifiers.Command],
    description: "Navigate in given direction, wrapping when necessary",
    representation: "VO-Command-Up Arrow",
  },
  cycleRightThroughNavigationSettings: {
    // VoiceOver documentation incorrect
    keyCode: KeyCodes.ArrowRight,
    modifiers: [...VO, Modifiers.Command],
    description:
      "Cycle through navigation settings (Headings, Form Controls, Landmarks, etc.)",
    representation: "VO-Command-Right Arrow",
  },
  navigateDown: {
    // VoiceOver documentation incorrect
    keyCode: KeyCodes.ArrowDown,
    modifiers: [...VO, Modifiers.Command],
    description: "Navigate in given direction, wrapping when necessary",
    representation: "VO-Command-Down Arrow",
  },
  cycleLeftThroughNavigationSettings: {
    // VoiceOver documentation incorrect
    keyCode: KeyCodes.ArrowLeft,
    modifiers: [...VO, Modifiers.Command],
    description:
      "Cycle through navigation settings (Headings, Form Controls, Landmarks, etc.)",
    representation: "VO-Command-Left Arrow",
  },
  toggleHotSpot1: {
    keyCode: KeyCodes.Digit1,
    modifiers: [...VO, Modifiers.Shift],
    description: "Toggle hot spot 1",
    representation: "VO-Shift-1",
  },
  toggleHotSpot2: {
    keyCode: KeyCodes.Digit2,
    modifiers: [...VO, Modifiers.Shift],
    description: "Toggle hot spot 2",
    representation: "VO-Shift-2",
  },
  toggleHotSpot3: {
    keyCode: KeyCodes.Digit3,
    modifiers: [...VO, Modifiers.Shift],
    description: "Toggle hot spot 3",
    representation: "VO-Shift-3",
  },
  toggleHotSpot4: {
    keyCode: KeyCodes.Digit4,
    modifiers: [...VO, Modifiers.Shift],
    description: "Toggle hot spot 4",
    representation: "VO-Shift-4",
  },
  toggleHotSpot5: {
    keyCode: KeyCodes.Digit5,
    modifiers: [...VO, Modifiers.Shift],
    description: "Toggle hot spot 5",
    representation: "VO-Shift-5",
  },
  toggleHotSpot6: {
    keyCode: KeyCodes.Digit6,
    modifiers: [...VO, Modifiers.Shift],
    description: "Toggle hot spot 6",
    representation: "VO-Shift-6",
  },
  toggleHotSpot7: {
    keyCode: KeyCodes.Digit7,
    modifiers: [...VO, Modifiers.Shift],
    description: "Toggle hot spot 7",
    representation: "VO-Shift-7",
  },
  toggleHotSpot8: {
    keyCode: KeyCodes.Digit8,
    modifiers: [...VO, Modifiers.Shift],
    description: "Toggle hot spot 8",
    representation: "VO-Shift-8",
  },
  toggleHotSpot9: {
    keyCode: KeyCodes.Digit9,
    modifiers: [...VO, Modifiers.Shift],
    description: "Toggle hot spot 9",
    representation: "VO-Shift-9",
  },
  toggleHotSpot0: {
    keyCode: KeyCodes.Digit0,
    modifiers: [...VO, Modifiers.Shift],
    description: "Toggle hot spot 0",
    representation: "VO-Shift-0",
  },
  jumpToHotSpot1: {
    keyCode: KeyCodes.Digit1,
    modifiers: VO,
    description: "Jump to hot spot 1",
    representation: "VO-1",
  },
  jumpToHotSpot2: {
    keyCode: KeyCodes.Digit2,
    modifiers: VO,
    description: "Jump to hot spot 2",
    representation: "VO-2",
  },
  jumpToHotSpot3: {
    keyCode: KeyCodes.Digit3,
    modifiers: VO,
    description: "Jump to hot spot 3",
    representation: "VO-3",
  },
  jumpToHotSpot4: {
    keyCode: KeyCodes.Digit4,
    modifiers: VO,
    description: "Jump to hot spot 4",
    representation: "VO-4",
  },
  jumpToHotSpot5: {
    keyCode: KeyCodes.Digit5,
    modifiers: VO,
    description: "Jump to hot spot 5",
    representation: "VO-5",
  },
  jumpToHotSpot6: {
    keyCode: KeyCodes.Digit6,
    modifiers: VO,
    description: "Jump to hot spot 6",
    representation: "VO-6",
  },
  jumpToHotSpot7: {
    keyCode: KeyCodes.Digit7,
    modifiers: VO,
    description: "Jump to hot spot 7",
    representation: "VO-7",
  },
  jumpToHotSpot8: {
    keyCode: KeyCodes.Digit8,
    modifiers: VO,
    description: "Jump to hot spot 8",
    representation: "VO-8",
  },
  jumpToHotSpot9: {
    keyCode: KeyCodes.Digit9,
    modifiers: VO,
    description: "Jump to hot spot 9",
    representation: "VO-9",
  },
  jumpToHotSpot0: {
    keyCode: KeyCodes.Digit0,
    modifiers: VO,
    description: "Jump to hot spot 0",
    representation: "VO-0",
  },
  describeHotSpot1: {
    keyCode: KeyCodes.Digit1,
    modifiers: [...VO, Modifiers.Command],
    description: "Hear a description of hot spot 1",
    representation: "VO-Command-1",
  },
  describeHotSpot2: {
    keyCode: KeyCodes.Digit2,
    modifiers: [...VO, Modifiers.Command],
    description: "Hear a description of hot spot 2",
    representation: "VO-Command-2",
  },
  describeHotSpot3: {
    keyCode: KeyCodes.Digit3,
    modifiers: [...VO, Modifiers.Command],
    description: "Hear a description of hot spot 3",
    representation: "VO-Command-3",
  },
  describeHotSpot4: {
    keyCode: KeyCodes.Digit4,
    modifiers: [...VO, Modifiers.Command],
    description: "Hear a description of hot spot 4",
    representation: "VO-Command-4",
  },
  describeHotSpot5: {
    keyCode: KeyCodes.Digit5,
    modifiers: [...VO, Modifiers.Command],
    description: "Hear a description of hot spot 5",
    representation: "VO-Command-5",
  },
  describeHotSpot6: {
    keyCode: KeyCodes.Digit6,
    modifiers: [...VO, Modifiers.Command],
    description: "Hear a description of hot spot 6",
    representation: "VO-Command-6",
  },
  describeHotSpot7: {
    keyCode: KeyCodes.Digit7,
    modifiers: [...VO, Modifiers.Command],
    description: "Hear a description of hot spot 7",
    representation: "VO-Command-7",
  },
  describeHotSpot8: {
    keyCode: KeyCodes.Digit8,
    modifiers: [...VO, Modifiers.Command],
    description: "Hear a description of hot spot 8",
    representation: "VO-Command-8",
  },
  describeHotSpot9: {
    keyCode: KeyCodes.Digit9,
    modifiers: [...VO, Modifiers.Command],
    description: "Hear a description of hot spot 9",
    representation: "VO-Command-9",
  },
  describeHotSpot0: {
    keyCode: KeyCodes.Digit0,
    modifiers: [...VO, Modifiers.Command],
    description: "Hear a description of hot spot 0",
    representation: "VO-Command-0",
  },
  monitorHotSpot1: {
    keyCode: KeyCodes.Digit1,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Monitor hot spot 1",
    representation: "VO-Command-Shift-1",
  },
  monitorHotSpot2: {
    keyCode: KeyCodes.Digit2,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Monitor hot spot 2",
    representation: "VO-Command-Shift-2",
  },
  monitorHotSpot3: {
    keyCode: KeyCodes.Digit3,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Monitor hot spot 3",
    representation: "VO-Command-Shift-3",
  },
  monitorHotSpot4: {
    keyCode: KeyCodes.Digit4,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Monitor hot spot 4",
    representation: "VO-Command-Shift-4",
  },
  monitorHotSpot5: {
    keyCode: KeyCodes.Digit5,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Monitor hot spot 5",
    representation: "VO-Command-Shift-5",
  },
  monitorHotSpot6: {
    keyCode: KeyCodes.Digit6,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Monitor hot spot 6",
    representation: "VO-Command-Shift-6",
  },
  monitorHotSpot7: {
    keyCode: KeyCodes.Digit7,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Monitor hot spot 7",
    representation: "VO-Command-Shift-7",
  },
  monitorHotSpot8: {
    keyCode: KeyCodes.Digit8,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Monitor hot spot 8",
    representation: "VO-Command-Shift-8",
  },
  monitorHotSpot9: {
    keyCode: KeyCodes.Digit9,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Monitor hot spot 9",
    representation: "VO-Command-Shift-9",
  },
  monitorHotSpot0: {
    keyCode: KeyCodes.Digit0,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Monitor hot spot 0",
    representation: "VO-Command-Shift-0",
  },
  jumpToParentFolder: {
    keyCode: KeyCodes.Backslash,
    modifiers: [...VO, Modifiers.Command],
    description: "Jump back to a parent folder",
    representation: "VO-Command-\\",
  },

  // Orientation Commands

  hearApplicationSummary: {
    keyCode: KeyCodes.F1,
    modifiers: VO,
    description: "Hear the application summary",
    representation: "VO-F1",
  },
  openApplicationChooser: {
    keyCode: [KeyCodes.F1, KeyCodes.F1],
    modifiers: VO,
    description: "Open the Application Chooser",
    representation: "VO-F1-F1",
  },
  hearWindowSummary: {
    keyCode: KeyCodes.F2,
    modifiers: VO,
    description: "Hear the window summary",
    representation: "VO-F2",
  },
  openWindowChooser: {
    keyCode: [KeyCodes.F2, KeyCodes.F2],
    modifiers: VO,
    description: "Open the Window Chooser ",
    representation: "VO-F2-F2",
  },
  describeItem: {
    keyCode: KeyCodes.F3,
    modifiers: VO,
    description: "Describe the item in the VoiceOver cursor",
    representation: "VO-F3",
  },
  describeItemSize: {
    keyCode: KeyCodes.F3,
    modifiers: [...VO, Modifiers.Command],
    description: "Describe the size of the item in the VoiceOver cursor",
    representation: "VO-Command-F3",
  },
  describeItemPosition: {
    keyCode: [KeyCodes.F3, KeyCodes.F3],
    modifiers: [...VO, Modifiers.Command],
    description: "Describe the position of the item in the VoiceOver cursor",
    representation: "VO-Command-F3-F3",
  },
  describeItemWithKeyboardFocus: {
    keyCode: KeyCodes.F4,
    modifiers: VO,
    description: "Describe the item that has the keyboard focus",
    representation: "VO-F4",
  },
  describeLocationOfInsertionPoint: {
    keyCode: [KeyCodes.F4, KeyCodes.F4],
    modifiers: VO,
    description:
      "Describe the location of the insertion point (from upper-left corner of screen)",
    representation: "VO-F4-F4",
  },
  describeItemUnderMouseCursor: {
    keyCode: KeyCodes.F5,
    modifiers: VO,
    description: "Describe the item under the mouse cursor",
    representation: "VO-F5",
  },
  describeLocationOfMouseInCoordinates: {
    keyCode: [KeyCodes.F5, KeyCodes.F5],
    modifiers: VO,
    description:
      "Describe the location of the mouse in x, y coordinates (from upper-left corner of screen)",
    representation: "VO-F5-F5",
  },
  describeLocationOfMouse: {
    keyCode: [KeyCodes.F5, KeyCodes.F5, KeyCodes.F5],
    modifiers: VO,
    description:
      "Describe the location of the mouse (from upper-left corner of window)",
    representation: "VO-F5-F5-F5",
  },
  describeSelectedItem: {
    keyCode: KeyCodes.F6,
    modifiers: VO,
    description: "Describe the selected item",
    representation: "VO-F6",
  },
  readEverythingInCursor: {
    keyCode: KeyCodes.a,
    modifiers: VO,
    description: "Read everything in the VoiceOver cursor",
    representation: "VO-A",
  },
  readEverythingInWindow: {
    keyCode: KeyCodes.w,
    modifiers: [...VO, Modifiers.Shift],
    description:
      "Read everything visible in the window or the Dock, or on your desktop, depending on your location",
    representation: "VO-Shift-W",
  },
  repeatLastSpokenPhrase: {
    keyCode: KeyCodes.z,
    modifiers: VO,
    description: "Repeat the last spoken phrase",
    representation: "VO-Z",
  },
  copyLastSpokenPhraseToClipboard: {
    keyCode: KeyCodes.c,
    modifiers: [...VO, Modifiers.Shift],
    description:
      'Copy the last spoken phrase to the Clipboard (also called the "Pasteboard")',
    representation: "VO-Shift-C",
  },
  saveLastSpokenPhraseToDesktop: {
    keyCode: KeyCodes.z,
    modifiers: [...VO, Modifiers.Shift],
    description:
      "Save the last spoken phrase and the crash log to a file on the desktop for troubleshooting",
    representation: "VO-Shift-Z",
  },

  // Search Commands

  find: {
    keyCode: KeyCodes.f,
    modifiers: VO,
    description: "Find",
    representation: "VO-F",
  },
  findNextSearchedText: {
    keyCode: KeyCodes.g,
    modifiers: VO,
    description: "Find the next searched text",
    representation: "VO-G",
  },
  findPreviousSearchedText: {
    keyCode: KeyCodes.g,
    modifiers: [...VO, Modifiers.Shift],
    description: "Find the previous searched text",
    representation: "VO-Shift-G",
  },
  findNextList: {
    keyCode: KeyCodes.x,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next list",
    representation: "VO-Command-X",
  },
  findPreviousList: {
    keyCode: KeyCodes.x,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous list",
    representation: "VO-Command-Shift-X",
  },
  findNextBoldText: {
    keyCode: KeyCodes.b,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next bold text",
    representation: "VO-Command-B",
  },
  findPreviousBoldText: {
    keyCode: KeyCodes.b,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous bold text",
    representation: "VO-Command-Shift-B",
  },
  findNextStyleChange: {
    keyCode: KeyCodes.c,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next style change",
    representation: "VO-Command-C",
  },
  findPreviousStyleChange: {
    keyCode: KeyCodes.c,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous style change",
    representation: "VO-Command-Shift-C",
  },
  findNextItalicText: {
    keyCode: KeyCodes.i,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next italic text",
    representation: "VO-Command-I",
  },
  findPreviousItalicText: {
    keyCode: KeyCodes.i,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous italic text",
    representation: "VO-Command-Shift-I",
  },
  findNextColorChange: {
    keyCode: KeyCodes.k,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next color change",
    representation: "VO-Command-K",
  },
  findPreviousColorChange: {
    keyCode: KeyCodes.k,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous color change",
    representation: "VO-Command-Shift-K",
  },
  findNextFontChange: {
    keyCode: KeyCodes.o,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next font change",
    representation: "VO-Command-O",
  },
  findPreviousFontChange: {
    keyCode: KeyCodes.o,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous font change",
    representation: "VO-Command-Shift-O",
  },
  findNextTable: {
    keyCode: KeyCodes.t,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next table",
    representation: "VO-Command-T",
  },
  findPreviousTable: {
    keyCode: KeyCodes.t,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous table",
    representation: "VO-Command-Shift-T",
  },
  findNextUnderlinedText: {
    keyCode: KeyCodes.u,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next underlined text",
    representation: "VO-Command-U",
  },
  findPreviousUnderlinedText: {
    keyCode: KeyCodes.u,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous underlined text",
    representation: "VO-Command-Shift-U",
  },
  findNextControl: {
    keyCode: KeyCodes.j,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next control",
    representation: "VO-Command-J",
  },
  findPreviousControl: {
    keyCode: KeyCodes.j,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous control",
    representation: "VO-Command-Shift-J",
  },
  findNextDifferentItem: {
    keyCode: KeyCodes.d,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next different item",
    representation: "VO-Command-D",
  },
  findPreviousDifferentItem: {
    keyCode: KeyCodes.d,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous different item",
    representation: "VO-Command-Shift-D",
  },
  findNextItemWithSameTypeAsCurrentItem: {
    keyCode: KeyCodes.s,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next item that's the same type as the current item",
    representation: "VO-Command-S",
  },
  findPreviousItemWithSameTypeAsCurrentItem: {
    keyCode: KeyCodes.s,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description:
      "Find the previous item that's the same type as the current item",
    representation: "VO-Command-Shift-S",
  },
  findNextGraphic: {
    keyCode: KeyCodes.g,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next graphic",
    representation: "VO-Command-G",
  },
  findPreviousGraphic: {
    keyCode: KeyCodes.g,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous graphic",
    representation: "VO-Command-Shift-G",
  },
  findNextHeading: {
    keyCode: KeyCodes.h,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next heading",
    representation: "VO-Command-H",
  },
  findPreviousHeading: {
    keyCode: KeyCodes.h,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous heading",
    representation: "VO-Command-Shift-H",
  },
  findNextLink: {
    keyCode: KeyCodes.l,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next link",
    representation: "VO-Command-L",
  },
  findPreviousLink: {
    keyCode: KeyCodes.l,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous link",
    representation: "VO-Command-Shift-L",
  },
  findNextHeadingOfSameLevel: {
    keyCode: KeyCodes.m,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next heading of the same level",
    representation: "VO-Command-M",
  },
  findPreviousHeadingOfSameLevel: {
    keyCode: KeyCodes.m,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous heading of the same level",
    representation: "VO-Command-Shift-M",
  },
  findNextPlainText: {
    keyCode: KeyCodes.p,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next plain text",
    representation: "VO-Command-P",
  },
  findPreviousPlainText: {
    keyCode: KeyCodes.p,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous plain text",
    representation: "VO-Command-Shift-P",
  },
  findNextVisitedLink: {
    keyCode: KeyCodes.v,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next visited link",
    representation: "VO-Command-V",
  },
  findPreviousVisitedLink: {
    keyCode: KeyCodes.v,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous visited link",
    representation: "VO-Command-Shift-V",
  },
  findNextMisspelledWord: {
    keyCode: KeyCodes.e,
    modifiers: [...VO, Modifiers.Command],
    description: "Find the next misspelled word",
    representation: "VO-Command-E",
  },
  findPreviousMisspelledWord: {
    keyCode: KeyCodes.e,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Find the previous misspelled word",
    representation: "VO-Command-Shift-E",
  },

  // Text Commands

  readAllText: {
    keyCode: KeyCodes.a,
    modifiers: VO,
    description:
      "Read all text from the VoiceOver cursor to the end of the text",
    representation: "VO-A",
  },
  selectAllText: {
    keyCode: KeyCodes.a,
    modifiers: [...VO, Modifiers.Shift],
    description: "Select all text in the VoiceOver cursor",
    representation: "VO-Shift-A",
  },
  toggleTextSelection: {
    keyCode: KeyCodes.Return,
    modifiers: VO,
    description:
      "Start and stop text selection in a text field (text selection tracking must be on)",
    representation: "VO-Return",
  },
  speakTextAttributes: {
    keyCode: KeyCodes.t,
    modifiers: VO,
    description: "Speak text attributes",
    representation: "VO-T",
  },
  readParagraph: {
    keyCode: KeyCodes.p,
    modifiers: VO,
    description: "Read paragraph in VoiceOver cursor",
    representation: "VO-P",
  },
  readNextParagraph: {
    keyCode: KeyCodes.PageDown,
    modifiers: [...VO, Modifiers.Shift],
    description: "Read next paragraph",
    representation: "VO-Shift-Page Down",
  },
  readPreviousParagraph: {
    keyCode: KeyCodes.PageUp,
    modifiers: [...VO, Modifiers.Shift],
    description: "Read previous paragraph",
    representation: "VO-Shift-Page Up",
  },
  readSentence: {
    keyCode: KeyCodes.s,
    modifiers: VO,
    description: "Read sentence in VoiceOver cursor",
    representation: "VO-S",
  },
  readNextSentence: {
    keyCode: KeyCodes.PageDown,
    modifiers: [...VO, Modifiers.Command],
    description: "Read next sentence",
    representation: "VO-Command-Page Down",
  },
  readPreviousSentence: {
    keyCode: KeyCodes.PageUp,
    modifiers: [...VO, Modifiers.Command],
    description: "Read previous sentence",
    representation: "VO-Command-Page Up",
  },
  readLine: {
    keyCode: KeyCodes.l,
    modifiers: VO,
    description: "Read line in VoiceOver cursor",
    representation: "VO-L",
  },
  readNextLine: {
    keyCode: KeyCodes.PageDown,
    modifiers: VO,
    description: "Read next line",
    representation: "VO-Down Arrow",
  },
  readPreviousLine: {
    keyCode: KeyCodes.PageUp,
    modifiers: VO,
    description: "Read previous line",
    representation: "VO-Up Arrow",
  },
  readWord: {
    keyCode: KeyCodes.w,
    modifiers: VO,
    description: "Read word in VoiceOver cursor",
    representation: "VO-W",
  },
  readWordSpelled: {
    keyCode: [KeyCodes.w, KeyCodes.w],
    modifiers: VO,
    description: "Read word spelled in VoiceOver cursor",
    representation: "VO-W-W",
  },
  readWordPhonetically: {
    keyCode: [KeyCodes.w, KeyCodes.w, KeyCodes.w],
    modifiers: VO,
    description: "Read word spelled phonetically in VoiceOver cursor",
    representation: "VO-W-W-W",
  },
  readNextWord: {
    keyCode: KeyCodes.ArrowRight,
    modifiers: VO,
    description: "Read next word",
    representation: "VO-Right Arrow",
  },
  readPreviousWord: {
    keyCode: KeyCodes.ArrowLeft,
    modifiers: VO,
    description: "Read previous word",
    representation: "VO-Left Arrow",
  },
  readCharacter: {
    keyCode: KeyCodes.c,
    modifiers: VO,
    description: "Read character in VoiceOver cursor",
    representation: "VO-W",
  },
  readCharacterPhonetically: {
    keyCode: [KeyCodes.c, KeyCodes.c],
    modifiers: VO,
    description: "Read character phonetically in VoiceOver cursor",
    representation: "VO-C-C",
  },
  readNextCharacter: {
    keyCode: KeyCodes.ArrowRight,
    modifiers: [...VO, Modifiers.Shift],
    description: "Read next character",
    representation: "VO-Shift-Right Arrow",
  },
  readPreviousCharacter: {
    keyCode: KeyCodes.ArrowLeft,
    modifiers: [...VO, Modifiers.Shift],
    description: "Read previous character",
    representation: "VO-Shift-Left Arrow",
  },
  moveToFirstVisibleWord: {
    keyCode: KeyCodes.Home,
    modifiers: VO,
    description: "Move to first visible word",
    representation: "VO-Home",
  },
  moveToLastVisibleWord: {
    keyCode: KeyCodes.End,
    modifiers: VO,
    description: "Move to last visible word",
    representation: "VO-End",
  },
  moveToBeginningOfText: {
    keyCode: KeyCodes.Home,
    modifiers: [...VO, Modifiers.Shift],
    description: "Move to beginning of text, scrolling if necessary",
    representation: "VO-Shift-Home",
  },
  moveToEndOfText: {
    keyCode: KeyCodes.End,
    modifiers: [...VO, Modifiers.Shift],
    description: "Move to end of text, scrolling if necessary",
    representation: "VO-Shift-End",
  },
  readCurrentWordAndCharacter: {
    keyCode: KeyCodes.F3,
    modifiers: VO,
    description: "Reads the current word and character in the VoiceOver cursor",
    representation: "VO-F3",
  },
  readNumberOfLines: {
    keyCode: [KeyCodes.F3, KeyCodes.F3],
    modifiers: VO,
    description:
      "Reads the total number of lines and the number of visible lines in a document",
    representation: "VO-F3-F3",
  },

  // Web Commands

  moveToNextColumn: {
    keyCode: KeyCodes.y,
    modifiers: [...VO, Modifiers.Command],
    description: "Move to the next column",
    representation: "VO-Command-Y",
  },
  moveToPreviousColumn: {
    keyCode: KeyCodes.y,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Move to the previous column",
    representation: "VO-Command-Shift-Y",
  },
  moveToNextFrame: {
    keyCode: KeyCodes.f,
    modifiers: [...VO, Modifiers.Command],
    description: "Move to the next frame",
    representation: "VO-Command-F",
  },
  moveToPreviousFrame: {
    keyCode: KeyCodes.f,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Move to the previous frame",
    representation: "VO-Command-Shift-F",
  },
  moveToNextAutoWebSpot: {
    keyCode: KeyCodes.n,
    modifiers: [...VO, Modifiers.Command],
    description: "Move to the next auto web spot",
    representation: "VO-Command-N",
  },
  moveToPreviousAutoWebSpot: {
    keyCode: KeyCodes.n,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Move to the previous auto web spot",
    representation: "VO-Command-Shift-N",
  },
  moveToNextWebSpot: {
    keyCode: KeyCodes.LeftSquareBracket,
    modifiers: [...VO, Modifiers.Command],
    description: "Move to the next web spot",
    representation: "VO-Command-]",
  },
  moveToPreviousWebSpot: {
    keyCode: KeyCodes.RightSquareBracket,
    modifiers: [...VO, Modifiers.Command],
    description: "Move to the previous web spot",
    representation: "VO-Command-[",
  },
  openWebItemRotor: {
    keyCode: KeyCodes.u,
    modifiers: VO,
    description: "Open the Web Item rotor",
    representation: "VO-U",
  },
  readFromBeginningToCurrent: {
    keyCode: KeyCodes.b,
    modifiers: VO,
    description: "Read from the beginning of a webpage to the current location",
    representation: "VO-B",
  },
  readLinkAddress: {
    keyCode: KeyCodes.u,
    modifiers: [...VO, Modifiers.Shift],
    description: "Read a link address (URL)",
    representation: "VO-Shift-U",
  },
  readWebpageStatistics: {
    keyCode: KeyCodes.i,
    modifiers: [...VO, Modifiers.Shift],
    description: "Read webpage statistics",
    representation: "VO-Shift-I",
  },
  removeWebSpot: {
    keyCode: KeyCodes.LeftSquareBracket,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Remove a web spot",
    representation: "VO-Command-Shift-{",
  },
  setWebSpot: {
    keyCode: KeyCodes.RightSquareBracket,
    modifiers: [...VO, Modifiers.Command, Modifiers.Shift],
    description: "Set a web spot",
    representation: "VO-Command-Shift-}",
  },
  setSweetSpot: {
    keyCode: [KeyCodes.RightSquareBracket, KeyCodes.RightSquareBracket],
    modifiers: [...VO, Modifiers.Shift],
    description: "Set the sweet spot",
    representation: "VO-Command-Shift-}-}",
  },
  toggleGroupingItemsWithinTable: {
    keyCode: KeyCodes.Equals,
    modifiers: VO,
    description: "Turn the grouping of items within a table on or off",
    representation: "VO-=",
  },
};
