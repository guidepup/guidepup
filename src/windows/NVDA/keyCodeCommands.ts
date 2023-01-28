import { KeyCodes } from "../KeyCodes";
import { Modifiers } from "../Modifiers";

const NVDA = [KeyCodes.Insert];

/**
 * Object of key code commands for the NVDA screen reader on Windows.
 *
 * References:
 *
 * - {@link https://www.nvaccess.org/files/nvda/releases/2021.2/documentation/keyCommands.html}
 * - {@link https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts}
 */
export const keyCodeCommands = {
  // Basic NVDA Commands
  start: {
    keyCode: KeyCodes.N,
    modifiers: [Modifiers.Control, Modifiers.Alt],
    description: "Turn NVDA on",
    representation: "Control-Alt-N",
  },
  stopSpeech: {
    keyCode: KeyCodes.Control,
    modifiers: [],
    description: "Instantly stops speaking",
    representation: "Control",
  },
  pauseSpeech: {
    keyCode: KeyCodes.Shift,
    modifiers: [],
    description:
      "Instantly pauses speech. Pressing it again will continue speaking where it left off (if pausing is supported by the current synthesizer)",
    representation: "Shift",
  },
  openUtilityMenu: {
    keyCode: [...NVDA, KeyCodes.N],
    modifiers: [],
    description:
      "Pops up the NVDA menu to allow you to access preferences, tools, help, etc.",
    representation: "NVDA-N",
  },
  toggleSpeechMode: {
    keyCode: [...NVDA, KeyCodes.S],
    modifiers: [],
    description: "Toggles speech mode between speech, beeps and off.",
    representation: "NVDA-S",
  },
  startKeyboardHelp: {
    keyCode: [...NVDA, KeyCodes.Digit1],
    modifiers: [],
    description:
      "Pressing any key in this mode will report the key, and the description of any NVDA command associated with it",
    representation: "NVDA-1",
  },
  stop: {
    keyCode: [...NVDA, KeyCodes.Q],
    modifiers: [],
    description: "Turn NVDA off",
    representation: "NVDA-Q",
  },
  ignoreNextKeyCombination: {
    keyCode: [...NVDA, KeyCodes.F2],
    modifiers: [],
    description:
      "Tells NVDA to pass the next key press straight through to the active application - even if it is normally treated as an NVDA key command",
    representation: "NVDA-F2",
  },
  toggleSleepMode: {
    keyCode: [...NVDA, KeyCodes.S],
    modifiers: [Modifiers.Shift],
    description:
      "sleep mode disables all NVDA commands and speech/braille output for the current application. This is most useful in applications that provide their own speech or screen reading features. Press this command again to disable sleep mode - note that NVDA will only retain the Sleep Mode setting until it is restarted.",
    representation: "NVDA-Shift-S",
  },

  // Reporting System Information

  reportDateTime: {
    keyCode: [...NVDA, KeyCodes.F12],
    modifiers: [],
    description:
      "Pressing once reports the current time, pressing twice reports the date",
    representation: "NVDA-F12",
  },
  reportBatteryStatus: {
    keyCode: [...NVDA, KeyCodes.B],
    modifiers: [Modifiers.Shift],
    description:
      "Reports the battery status i.e. whether AC power is in use or the current charge percentage.",
    representation: "NVDA-Shift-B",
  },
  reportClipboardText: {
    keyCode: [...NVDA, KeyCodes.C],
    modifiers: [],
    description: "Reports the Text on the clipboard if there is any.",
    representation: "NVDA-C",
  },

  // Navigating with the System Focus

  reportCurrentFocus: {
    keyCode: [...NVDA, KeyCodes.Tab],
    modifiers: [],
    description:
      "Announces the current object or control that has the System focus. Pressing twice will spell the information",
    representation: "NVDA-Tab",
  },
  reportTitle: {
    keyCode: [...NVDA, KeyCodes.T],
    modifiers: [],
    description:
      "Reports the title of the currently active window. Pressing twice will spell the information. Pressing three times will copy it to the clipboard",
    representation: "NVDA-T",
  },
  readActiveWindow: {
    keyCode: [...NVDA, KeyCodes.B],
    modifiers: [],
    description:
      "Reads all the controls in the currently active window (useful for dialogs)",
    representation: "NVDA-B",
  },
  reportStatusBar: {
    keyCode: [...NVDA, KeyCodes.End],
    modifiers: [],
    description:
      "Reports the Status Bar if NVDA finds one. It also moves the navigator object to this location. Pressing twice will spell the information. Pressing three times will copy it to the clipboard",
    representation: "NVDA-End",
  },

  // Navigating with the System Caret

  sayAll: {
    keyCode: [...NVDA, KeyCodes.ArrowDown],
    modifiers: [],
    description:
      "Starts reading from the current position of the system caret, moving it along as it goes",
    representation: "NVDA-Down Arrow",
  },
  readLine: {
    keyCode: [...NVDA, KeyCodes.ArrowUp],
    modifiers: [],
    description:
      "Reads the line where the system caret is currently situated. Pressing twice spells the line. Pressing three times spells the line using character descriptions.",
    representation: "NVDA-Up Arrow",
  },
  readCurrentSelection: {
    keyCode: [...NVDA, KeyCodes.ArrowUp],
    modifiers: [Modifiers.Shift],
    description: "Reads any currently selected text",
    representation: "NVDA-Shift-Up Arrow",
  },
  reportTextFormatting: {
    keyCode: [...NVDA, KeyCodes.F],
    modifiers: [],
    description:
      "Reports the formatting of the text where the caret is currently situated. Pressing twice shows the information in browse mode",
    representation: "NVDA-F",
  },
  readNextSentence: {
    keyCode: [KeyCodes.ArrowDown],
    modifiers: [Modifiers.Alt],
    description:
      "Moves the caret to the next sentence and announces it. (only supported in Microsoft Word and Outlook)",
    representation: "Alt-Down Arrow",
  },
  readPreviousSentence: {
    keyCode: [KeyCodes.ArrowUp],
    modifiers: [Modifiers.Alt],
    description:
      "Moves the caret to the previous sentence and announces it. (only supported in Microsoft Word and Outlook)",
    representation: "Alt-Up Arrow",
  },
  moveToPreviousColumn: {
    keyCode: [KeyCodes.ArrowLeft],
    modifiers: [Modifiers.Control, Modifiers.Alt],
    description:
      "When within a table, moves the system caret to the previous column (staying in the same row)",
    representation: "Control-Alt-Left Arrow",
  },
  moveToNextColumn: {
    keyCode: [KeyCodes.ArrowRight],
    modifiers: [Modifiers.Control, Modifiers.Alt],
    description:
      "When within a table, moves the system caret to the next column (staying in the same row)",
    representation: "Control-Alt-Right Arrow",
  },
  moveToPreviousRow: {
    keyCode: [KeyCodes.ArrowUp],
    modifiers: [Modifiers.Control, Modifiers.Alt],
    description:
      "When within a table, moves the system caret to the previous row (staying in the same column)",
    representation: "Control-Alt-Up Arrow",
  },
  moveToNextRow: {
    keyCode: [KeyCodes.ArrowDown],
    modifiers: [Modifiers.Control, Modifiers.Alt],
    description:
      "When within a table, moves the system caret to the next row (staying in the same column)",
    representation: "Control-Alt-Down Arrow",
  },

  // Object Navigation

  reportCurrentObject: {
    keyCode: [...NVDA, KeyCodes.NumPad5],
    modifiers: [],
    description:
      "Reports the current navigator object. Pressing twice spells the information, and pressing 3 times copies this object's name and value to the clipboard.",
    representation: "NVDA-NumPad5",
  },
  moveToContainingObject: {
    keyCode: [...NVDA, KeyCodes.NumPad8],
    modifiers: [],
    description: "Moves to the object containing the current navigator object",
    representation: "NVDA-NumPad8",
  },
  moveToPreviousObject: {
    keyCode: [...NVDA, KeyCodes.NumPad4],
    modifiers: [],
    description: "Moves to the object before the current navigator object",
    representation: "NVDA-NumPad4",
  },
  moveToNextObject: {
    keyCode: [...NVDA, KeyCodes.NumPad6],
    modifiers: [],
    description: "Moves to the object after the current navigator object",
    representation: "NVDA-NumPad6",
  },
  moveToFirstContainedObject: {
    keyCode: [...NVDA, KeyCodes.NumPad2],
    modifiers: [],
    description:
      "Moves to the first object contained by the current navigator object",
    representation: "NVDA-NumPad2",
  },
  moveToFocusObject: {
    keyCode: [...NVDA, KeyCodes.NumPadMinus],
    modifiers: [],
    description:
      "Moves to the object that currently has the system focus, and also places the review cursor at the position of the System caret, if it is showing",
    representation: "NVDA-NumPadMinus",
  },
  activateCurrentNavigatorObject: {
    keyCode: [...NVDA, KeyCodes.NumPadEnter],
    modifiers: [],
    description:
      "Activates the current navigator object (similar to clicking with the mouse or pressing space when it has the system focus)",
    representation: "NVDA-NumPadEnter",
  },
  moveToReviewPosition: {
    keyCode: [...NVDA, KeyCodes.NumPadMinus],
    modifiers: [Modifiers.Shift],
    description:
      "pressed once Moves the System focus to the current navigator object, pressed twice moves the system caret to the position of the review cursor",
    representation: "NVDA-Shift-NumPadMinus",
  },
  reportReviewPosition: {
    keyCode: [...NVDA, KeyCodes.NumPadDelete],
    modifiers: [],
    description:
      "Reports information about the location of the text or object at the review cursor. For example, this might include the percentage through the document, the distance from the edge of the page or the exact screen position. Pressing twice may provide further detail.",
    representation: "NVDA-NumPadDelete",
  },

  // Reviewing Text

  moveToTopLineInReview: {
    keyCode: [KeyCodes.NumPad7],
    modifiers: [Modifiers.Shift],
    description: "Moves the review cursor to the top line of the text",
    representation: "Shift-NumPad7",
  },
  moveToPreviousLineInReview: {
    keyCode: [KeyCodes.NumPad7],
    modifiers: [],
    description: "Moves the review cursor to the previous line of text",
    representation: "NumPad7",
  },
  reportCurrentLineInReview: {
    keyCode: [KeyCodes.NumPad8],
    modifiers: [],
    description:
      "Announces the current line of text where the review cursor is positioned. Pressing twice spells the line. Pressing three times spells the line using character descriptions.",
    representation: "NumPad8",
  },
  moveToNextLineInReview: {
    keyCode: [KeyCodes.NumPad9],
    modifiers: [],
    description: "Move the review cursor to the next line of text",
    representation: "NumPad9",
  },
  moveToBottomLineInReview: {
    keyCode: [KeyCodes.NumPad9],
    modifiers: [Modifiers.Shift],
    description: "Moves the review cursor to the bottom line of text",
    representation: "Shift-NumPad9",
  },
  moveToPreviousWordInReview: {
    keyCode: [KeyCodes.NumPad4],
    modifiers: [],
    description: "Moves the review cursor to the previous word in the text",
    representation: "NumPad4",
  },
  reportCurrentWordInReview: {
    keyCode: [KeyCodes.NumPad5],
    modifiers: [],
    description:
      "Announces the current word in the text where the review cursor is positioned. Pressing twice spells the word. Pressing three times spells the word using character descriptions.",
    representation: "NumPad5",
  },
  moveToNextWordInReview: {
    keyCode: [KeyCodes.NumPad6],
    modifiers: [],
    description: "Move the review cursor to the next word in the text",
    representation: "NumPad6",
  },
  moveToStartOfLineInReview: {
    keyCode: [KeyCodes.NumPad1],
    modifiers: [Modifiers.Shift],
    description:
      "Moves the review cursor to the start of the current line in the text",
    representation: "Shift-NumPad1",
  },
  moveToPreviousCharacterInReview: {
    keyCode: [KeyCodes.NumPad1],
    modifiers: [],
    description:
      "Moves the review cursor to the previous character on the current line in the text",
    representation: "NumPad1",
  },
  reportCurrentCharacterInReview: {
    keyCode: [KeyCodes.NumPad2],
    modifiers: [],
    description:
      "Announces the current character on the line of text where the review cursor is positioned. Pressing twice reports a description or example of that character. Pressing three times reports the numeric value of the character in decimal and hexadecimal.",
    representation: "NumPad2",
  },
  moveToNextCharacterInReview: {
    keyCode: [KeyCodes.NumPad3],
    modifiers: [],
    description:
      "Move the review cursor to the next character on the current line of text",
    representation: "NumPad3",
  },
  moveToEndOfLineInReview: {
    keyCode: [KeyCodes.NumPad3],
    modifiers: [Modifiers.Shift],
    description:
      "Moves the review cursor to the end of the current line of text",
    representation: "Shift-NumPad3",
  },
  sayAllWithReview: {
    keyCode: [KeyCodes.NumPadPlus],
    modifiers: [],
    description:
      "Reads from the current position of the review cursor, moving it as it goes",
    representation: "NumPadPlus",
  },
  selectThenCopyFromReviewCursor: {
    keyCode: [...NVDA, KeyCodes.F9],
    modifiers: [],
    description:
      "Starts the select then copy process from the current position of the review cursor. The actual action is not performed until you tell NVDA where the end of the text range is",
    representation: "NVDA-F9",
  },
  selectThenCopyToReviewCursor: {
    keyCode: [...NVDA, KeyCodes.F10],
    modifiers: [],
    description:
      "On the first press, text is selected from the position previously set as start marker up to and including the review cursor's current position. If the system caret can reach the text, it will be moved to the selected text. After pressing this key stroke a second time, the text will be copied to the Windows clipboard",
    representation: "NVDA-F10",
  },
  moveToMarkedStartForCopyInReview: {
    keyCode: [...NVDA, KeyCodes.F9],
    modifiers: [Modifiers.Shift],
    description:
      "Moves the review cursor to the position previously set start marker for copy",
    representation: "NVDA-Shift-F9",
  },
  reportTextFormattingInReview: {
    keyCode: [...NVDA, KeyCodes.F],
    modifiers: [Modifiers.Shift],
    description:
      "Reports the formatting of the text where the review cursor is currently situated. Pressing twice shows the information in browse mode",
    representation: "NVDA-Shift-F",
  },

  // Review Modes

  switchToNextReviewMode: {
    keyCode: [...NVDA, KeyCodes.NumPad7],
    modifiers: [],
    description: "switches to the next available review mode",
    representation: "NVDA-NumPad7",
  },
  switchToPreviousReviewMode: {
    keyCode: [...NVDA, KeyCodes.NumPad1],
    modifiers: [],
    description: "switches to the previous available review mode",
    representation: "NVDA-NumPad1",
  },

  // Navigating with the Mouse

  leftMouseClick: {
    keyCode: [KeyCodes.NumPadDivide],
    modifiers: [],
    description:
      "Clicks the left mouse button once. The common double click can be performed by pressing this key twice in quick succession",
    representation: "NumPadDivide",
  },
  leftMouseButtonLock: {
    keyCode: [KeyCodes.NumPadDivide],
    modifiers: [Modifiers.Shift],
    description:
      "Locks the left mouse button down. Press again to release it. To drag the mouse, press this key to lock the left button down and then move the mouse either physically or use one of the other mouse routing commands",
    representation: "Shift-NumPadDivide",
  },
  rightMouseClick: {
    keyCode: [KeyCodes.NumPadMultiply],
    modifiers: [],
    description:
      "Clicks the right mouse button once, mostly used to open context menu at the location of the mouse.",
    representation: "NumPadMultiply",
  },
  rightMouseButtonLock: {
    keyCode: [KeyCodes.NumPadMultiply],
    modifiers: [Modifiers.Shift],
    description:
      "Locks the right mouse button down. Press again to release it. To drag the mouse, press this key to lock the right button down and then move the mouse either physically or use one of the other mouse routing commands",
    representation: "Shift-NumPadMultiply",
  },
  moveMouseToCurrentNavigatorObject: {
    keyCode: [...NVDA, KeyCodes.NumPadDivide],
    modifiers: [],
    description:
      "Moves the mouse to the location of the current navigator object and review cursor",
    representation: "NVDA-NumPadDivide",
  },
  navigateToObjectUnderMouse: {
    keyCode: [...NVDA, KeyCodes.NumPadMultiply],
    modifiers: [],
    description:
      "Set the navigator object to the object located at the position of the mouse",
    representation: "NVDA-NumPadMultiply",
  },

  // Browse Mode

  toggleBetweenBrowseAndFocusMode: {
    keyCode: [...NVDA, KeyCodes.Spacebar],
    modifiers: [],
    description: "Toggles between focus mode and browse mode",
    representation: "NVDA-Space bar",
  },
  exitFocusMode: {
    keyCode: [KeyCodes.Escape],
    modifiers: [],
    description:
      "Switches back to browse mode if focus mode was previously switched to automatically",
    representation: "Escape",
  },
  refreshBrowseDocument: {
    keyCode: [...NVDA, KeyCodes.F5],
    modifiers: [],
    description:
      "Reloads the current document content (useful if certain content seems to be missing from the document. Not available in Microsoft Word and Outlook.)",
    representation: "NVDA-F5",
  },
  find: {
    keyCode: [...NVDA, KeyCodes.F],
    modifiers: [Modifiers.Control],
    description:
      "Pops up a dialog in which you can type some text to find in the current document. See searching for text for more information.",
    representation: "NVDA-Control-F",
  },
  findNext: {
    keyCode: [...NVDA, KeyCodes.F3],
    modifiers: [],
    description:
      "Finds the next occurrence of the text in the document that you previously searched for",
    representation: "NVDA-F3",
  },
  findPrevious: {
    keyCode: [...NVDA, KeyCodes.F3],
    modifiers: [Modifiers.Shift],
    description:
      "Finds the previous occurrence of the text in the document you previously searched for",
    representation: "NVDA-Shift-F3",
  },
  openLongDescription: {
    keyCode: [...NVDA, KeyCodes.D],
    modifiers: [],
    description:
      "Opens a new window containing a long description for the element you are on if it has one.",
    representation: "NVDA-D",
  },

  // Single Letter Navigation

  moveToNextHeading: {
    keyCode: [KeyCodes.H],
    modifiers: [],
    description: "Move to next heading",
    representation: "H",
  },
  moveToPreviousHeading: {
    keyCode: [KeyCodes.H],
    modifiers: [Modifiers.Shift],
    description: "Move to previous heading",
    representation: "Shift-H",
  },
  moveToNextList: {
    keyCode: [KeyCodes.L],
    modifiers: [],
    description: "Move to next list",
    representation: "L",
  },
  moveToPreviousList: {
    keyCode: [KeyCodes.L],
    modifiers: [Modifiers.Shift],
    description: "Move to previous list",
    representation: "Shift-L",
  },
  moveToNextListItem: {
    keyCode: [KeyCodes.I],
    modifiers: [],
    description: "Move to next list item",
    representation: "I",
  },
  moveToPreviousListItem: {
    keyCode: [KeyCodes.I],
    modifiers: [Modifiers.Shift],
    description: "Move to previous list item",
    representation: "Shift-I",
  },
  moveToNextTable: {
    keyCode: [KeyCodes.T],
    modifiers: [],
    description: "Move to next table",
    representation: "T",
  },
  moveToPreviousTable: {
    keyCode: [KeyCodes.T],
    modifiers: [Modifiers.Shift],
    description: "Move to previous table",
    representation: "Shift-T",
  },
  moveToNextLink: {
    keyCode: [KeyCodes.K],
    modifiers: [],
    description: "Move to next link",
    representation: "K",
  },
  moveToPreviousLink: {
    keyCode: [KeyCodes.K],
    modifiers: [Modifiers.Shift],
    description: "Move to previous link",
    representation: "Shift-K",
  },
  moveToNextNonLinkedText: {
    keyCode: [KeyCodes.N],
    modifiers: [],
    description: "Move to next non linked text",
    representation: "N",
  },
  moveToPreviousNonLinkedText: {
    keyCode: [KeyCodes.N],
    modifiers: [Modifiers.Shift],
    description: "Move to previous non linked text",
    representation: "Shift-N",
  },
  moveToNextFormField: {
    keyCode: [KeyCodes.F],
    modifiers: [],
    description: "Move to next form field",
    representation: "F",
  },
  moveToPreviousFormField: {
    keyCode: [KeyCodes.F],
    modifiers: [Modifiers.Shift],
    description: "Move to previous form field",
    representation: "Shift-F",
  },
  moveToNextUnvisitedLink: {
    keyCode: [KeyCodes.U],
    modifiers: [],
    description: "Move to next unvisited link",
    representation: "U",
  },
  moveToPreviousUnvisitedLink: {
    keyCode: [KeyCodes.U],
    modifiers: [Modifiers.Shift],
    description: "Move to previous unvisited link",
    representation: "Shift-U",
  },
  moveToNextVisitedLink: {
    keyCode: [KeyCodes.V],
    modifiers: [],
    description: "Move to next visited link",
    representation: "V",
  },
  moveToPreviousVisitedLink: {
    keyCode: [KeyCodes.V],
    modifiers: [Modifiers.Shift],
    description: "Move to previous visited link",
    representation: "Shift-V",
  },
  moveToNextEditField: {
    keyCode: [KeyCodes.E],
    modifiers: [],
    description: "Move to next edit field",
    representation: "E",
  },
  moveToPreviousEditField: {
    keyCode: [KeyCodes.E],
    modifiers: [Modifiers.Shift],
    description: "Move to previous edit field",
    representation: "Shift-E",
  },
  moveToNextButton: {
    keyCode: [KeyCodes.B],
    modifiers: [],
    description: "Move to next button",
    representation: "B",
  },
  moveToPreviousButton: {
    keyCode: [KeyCodes.B],
    modifiers: [Modifiers.Shift],
    description: "Move to previous button",
    representation: "Shift-B",
  },
  moveToNextCheckbox: {
    keyCode: [KeyCodes.X],
    modifiers: [],
    description: "Move to next checkbox",
    representation: "X",
  },
  moveToPreviousCheckbox: {
    keyCode: [KeyCodes.X],
    modifiers: [Modifiers.Shift],
    description: "Move to previous checkbox",
    representation: "Shift-X",
  },
  moveToNextComboBox: {
    keyCode: [KeyCodes.C],
    modifiers: [],
    description: "Move to next combo box",
    representation: "C",
  },
  moveToPreviousComboBox: {
    keyCode: [KeyCodes.C],
    modifiers: [Modifiers.Shift],
    description: "Move to previous combo box",
    representation: "Shift-C",
  },
  moveToNextRadioButton: {
    keyCode: [KeyCodes.R],
    modifiers: [],
    description: "Move to next radio button",
    representation: "R",
  },
  moveToPreviousRadioButton: {
    keyCode: [KeyCodes.R],
    modifiers: [Modifiers.Shift],
    description: "Move to previous radio button",
    representation: "Shift-R",
  },
  moveToNextBlockQuote: {
    keyCode: [KeyCodes.Q],
    modifiers: [],
    description: "Move to next block quote",
    representation: "Q",
  },
  moveToPreviousBlockQuote: {
    keyCode: [KeyCodes.Q],
    modifiers: [Modifiers.Shift],
    description: "Move to previous block quote",
    representation: "Shift-Q",
  },
  moveToNextSeparator: {
    keyCode: [KeyCodes.S],
    modifiers: [],
    description: "Move to next separator",
    representation: "S",
  },
  moveToPreviousSeparator: {
    keyCode: [KeyCodes.S],
    modifiers: [Modifiers.Shift],
    description: "Move to previous separator",
    representation: "Shift-S",
  },
  moveToNextFrame: {
    keyCode: [KeyCodes.M],
    modifiers: [],
    description: "Move to next frame",
    representation: "M",
  },
  moveToPreviousFrame: {
    keyCode: [KeyCodes.M],
    modifiers: [Modifiers.Shift],
    description: "Move to previous frame",
    representation: "Shift-M",
  },
  moveToNextGraphic: {
    keyCode: [KeyCodes.G],
    modifiers: [],
    description: "Move to next graphic",
    representation: "G",
  },
  moveToPreviousGraphic: {
    keyCode: [KeyCodes.G],
    modifiers: [Modifiers.Shift],
    description: "Move to previous graphic",
    representation: "Shift-G",
  },
  moveToNextLandmark: {
    keyCode: [KeyCodes.D],
    modifiers: [],
    description: "Move to next landmark",
    representation: "D",
  },
  moveToPreviousLandmark: {
    keyCode: [KeyCodes.D],
    modifiers: [Modifiers.Shift],
    description: "Move to previous landmark",
    representation: "Shift-D",
  },
  moveToNextEmbeddedObject: {
    keyCode: [KeyCodes.O],
    modifiers: [],
    description: "Move to next embedded object",
    representation: "O",
  },
  moveToPreviousEmbeddedObject: {
    keyCode: [KeyCodes.O],
    modifiers: [Modifiers.Shift],
    description: "Move to previous embedded object",
    representation: "Shift-O",
  },
  moveToNextHeadingLevel1: {
    keyCode: [KeyCodes.Digit1],
    modifiers: [],
    description: "Move to next heading level 1",
    representation: "1",
  },
  moveToPreviousHeadingLevel1: {
    keyCode: [KeyCodes.Digit1],
    modifiers: [Modifiers.Shift],
    description: "Move to previous heading level 1",
    representation: "Shift-1",
  },
  moveToNextHeadingLevel2: {
    keyCode: [KeyCodes.Digit2],
    modifiers: [],
    description: "Move to next heading level 2",
    representation: "2",
  },
  moveToPreviousHeadingLevel2: {
    keyCode: [KeyCodes.Digit2],
    modifiers: [Modifiers.Shift],
    description: "Move to previous heading level 2",
    representation: "Shift-2",
  },
  moveToNextHeadingLevel3: {
    keyCode: [KeyCodes.Digit3],
    modifiers: [],
    description: "Move to next heading level 3",
    representation: "3",
  },
  moveToPreviousHeadingLevel3: {
    keyCode: [KeyCodes.Digit3],
    modifiers: [Modifiers.Shift],
    description: "Move to previous heading level 3",
    representation: "Shift-3",
  },
  moveToNextHeadingLevel4: {
    keyCode: [KeyCodes.Digit4],
    modifiers: [],
    description: "Move to next heading level 4",
    representation: "4",
  },
  moveToPreviousHeadingLevel4: {
    keyCode: [KeyCodes.Digit4],
    modifiers: [Modifiers.Shift],
    description: "Move to previous heading level 4",
    representation: "Shift-4",
  },
  moveToNextHeadingLevel5: {
    keyCode: [KeyCodes.Digit5],
    modifiers: [],
    description: "Move to next heading level 5",
    representation: "5",
  },
  moveToPreviousHeadingLevel5: {
    keyCode: [KeyCodes.Digit5],
    modifiers: [Modifiers.Shift],
    description: "Move to previous heading level 5",
    representation: "Shift-5",
  },
  moveToNextHeadingLevel6: {
    keyCode: [KeyCodes.Digit6],
    modifiers: [],
    description: "Move to next heading level 6",
    representation: "6",
  },
  moveToPreviousHeadingLevel6: {
    keyCode: [KeyCodes.Digit6],
    modifiers: [Modifiers.Shift],
    description: "Move to previous heading level 6",
    representation: "Shift-6",
  },
  moveToNextAnnotation: {
    keyCode: [KeyCodes.A],
    modifiers: [],
    description: "Move to next annotation",
    representation: "A",
  },
  moveToPreviousAnnotation: {
    keyCode: [KeyCodes.A],
    modifiers: [Modifiers.Shift],
    description: "Move to previous annotation",
    representation: "Shift-A",
  },
  moveToNextSpellingError: {
    keyCode: [KeyCodes.W],
    modifiers: [],
    description: "Move to next spelling error",
    representation: "W",
  },
  moveToPreviousSpellingError: {
    keyCode: [KeyCodes.W],
    modifiers: [Modifiers.Shift],
    description: "Move to previous spelling error",
    representation: "Shift-W",
  },
  moveToStartOfContainer: {
    keyCode: [KeyCodes.Comma],
    modifiers: [Modifiers.Shift],
    description:
      "Moves to the start of the container (list, table, etc.) where the caret is positioned",
    representation: "Shift-,",
  },
  movePastEndOfContainer: {
    keyCode: [KeyCodes.Comma],
    modifiers: [],
    description:
      "Moves past the end of the container (list, table, etc.) where the caret is positioned",
    representation: ",",
  },
  toggleSingleLetterNavigation: {
    keyCode: [...NVDA, KeyCodes.Spacebar],
    modifiers: [Modifiers.Shift],
    description:
      "Toggles single letter navigation on and off for the current document.",
    representation: "NVDA-Shift-Space bar",
  },

  // The Elements List

  browseModeElementsList: {
    keyCode: [...NVDA, KeyCodes.F7],
    modifiers: [],
    description: "Lists various types of elements in the current document",
    representation: "NVDA-F7",
  },

  // Embedded Objects

  moveToContainingBrowseModeDocument: {
    keyCode: [...NVDA, KeyCodes.Spacebar],
    modifiers: [Modifiers.Control],
    description:
      "Moves the focus out of the current embedded object and into the document that contains it",
    representation: "NVDA-Control-Space bar",
  },

  // Reading Mathematical Content

  interactWithMathContent: {
    keyCode: [...NVDA, KeyCodes.M],
    modifiers: [Modifiers.Alt],
    description: "Begins interaction with math content.",
    representation: "NVDA-Alt-M",
  },

  // Configuring NVDA

  openSpeechSettings: {
    keyCode: [...NVDA, KeyCodes.V],
    modifiers: [Modifiers.Control],
    description: "Open speech settings.",
    representation: "NVDA-Control-V",
  },
  punctuationLevel: {
    keyCode: [...NVDA, KeyCodes.P],
    modifiers: [],
    description:
      "This allows you to choose the amount of punctuation and other symbols that should be spoken as words.",
    representation: "NVDA-P",
  },
  selectSynthesizer: {
    keyCode: [...NVDA, KeyCodes.S],
    modifiers: [Modifiers.Control],
    description: "Select Synthesizer.",
    representation: "NVDA-Control-S",
  },
  audioDuckingMode: {
    keyCode: [...NVDA, KeyCodes.D],
    modifiers: [Modifiers.Shift],
    description:
      "On Windows 8 and above, this option allows you to choose if NVDA should lower the volume of other applications while NVDA is speaking, or all the time while NVDA is running.",
    representation: "NVDA-Shift-D",
  },
  moveToNextSynthSetting: {
    keyCode: [...NVDA, KeyCodes.ArrowRight],
    modifiers: [Modifiers.Control],
    description:
      "Moves to the next available speech setting after the current, wrapping around to the first setting again after the last",
    representation: "NVDA-Control-Right Arrow",
  },
  moveToPreviousSynthSetting: {
    keyCode: [...NVDA, KeyCodes.ArrowLeft],
    modifiers: [Modifiers.Control],
    description:
      "Moves to the next available speech setting before the current, wrapping around to the last setting after the first",
    representation: "NVDA-Control-Left Arrow",
  },
  incrementCurrentSynthSetting: {
    keyCode: [...NVDA, KeyCodes.ArrowUp],
    modifiers: [Modifiers.Control],
    description:
      "increases the current speech setting you are on. E.g. increases the rate, chooses the next voice, increases the volume",
    representation: "NVDA-Control-Up Arrow",
  },
  decrementCurrentSynthSetting: {
    keyCode: [...NVDA, KeyCodes.ArrowDown],
    modifiers: [Modifiers.Control],
    description:
      "decreases the current speech setting you are on. E.g. decreases the rate, chooses the previous voice, decreases the volume",
    representation: "NVDA-Control-Down Arrow",
  },
  tetherBraille: {
    keyCode: [...NVDA, KeyCodes.T],
    modifiers: [Modifiers.Control],
    description:
      "This option allows you to choose whether the braille display will follow the system focus / caret, the navigator object / review cursor, or both.",
    representation: "NVDA-Control-T",
  },
  openKeyboardSettings: {
    keyCode: [...NVDA, KeyCodes.K],
    modifiers: [Modifiers.Control],
    description: "Open keyboard settings.",
    representation: "NVDA-Control-K",
  },
  speakTypedCharacters: {
    keyCode: [...NVDA, KeyCodes.Digit2],
    modifiers: [],
    description:
      "When enabled, NVDA will announce all characters you type on the keyboard.",
    representation: "NVDA-2",
  },
  speakTypedWords: {
    keyCode: [...NVDA, KeyCodes.Digit3],
    modifiers: [],
    description:
      "When enabled, NVDA will announce all words you type on the keyboard.",
    representation: "NVDA-3",
  },
  speakCommandKeys: {
    keyCode: [...NVDA, KeyCodes.Digit4],
    modifiers: [],
    description:
      "When enabled, NVDA will announce all non-character keys you type on the keyboard. This includes key combinations such as control plus another letter.",
    representation: "NVDA-4",
  },
  openMouseSettings: {
    keyCode: [...NVDA, KeyCodes.M],
    modifiers: [Modifiers.Control],
    description: "Open mouse settings.",
    representation: "NVDA-Control-M",
  },
  enableMouseTracking: {
    keyCode: [...NVDA, KeyCodes.M],
    modifiers: [],
    description:
      "When enabled, NVDA will announce the text currently under the mouse pointer, as you move it around the screen. This allows you to find things on the screen, by physically moving the mouse, rather than trying to find them through object navigation.",
    representation: "NVDA-M",
  },
  reviewCursorFollowSystemFocus: {
    keyCode: [...NVDA, KeyCodes.Digit7],
    modifiers: [],
    description:
      "When enabled, The review cursor will always be placed in the same object as the current system focus whenever the focus changes.",
    representation: "NVDA-7",
  },
  reviewCursorFollowSystemCaret: {
    keyCode: [...NVDA, KeyCodes.Digit6],
    modifiers: [],
    description:
      "When enabled, the review cursor will automatically be moved to the position of the System caret each time it moves",
    representation: "NVDA-6",
  },
  openObjectPresentationSettings: {
    keyCode: [...NVDA, KeyCodes.O],
    modifiers: [Modifiers.Control],
    description: "Open Object Presentation Settings.",
    representation: "NVDA-Control-O",
  },
  progressBarOutput: {
    keyCode: [...NVDA, KeyCodes.U],
    modifiers: [],
    description:
      "This option controls how NVDA reports progress bar updates to you.",
    representation: "NVDA-U",
  },
  reportDynamicContentChanges: {
    keyCode: [...NVDA, KeyCodes.Digit5],
    modifiers: [],
    description:
      "Toggles the announcement of new content in particular objects such as terminals and the history control in chat programs.",
    representation: "NVDA-5",
  },
  openBrowseModeSettings: {
    keyCode: [...NVDA, KeyCodes.B],
    modifiers: [Modifiers.Control],
    description: "Open Browse Mode Settings.",
    representation: "NVDA-Control-B",
  },
  useScreenLayout: {
    keyCode: [...NVDA, KeyCodes.V],
    modifiers: [],
    description:
      "This option allows you to specify whether content in browse mode should place content such as links and other fields on their own line, or if it should keep them in the flow of text as it is visually shown.",
    representation: "NVDA-V",
  },
  saveConfiguration: {
    keyCode: [...NVDA, KeyCodes.C],
    modifiers: [Modifiers.Control],
    description:
      "Saves your current configuration so that it is not lost when you exit NVDA",
    representation: "NVDA-Control-C",
  },
  revertConfiguration: {
    keyCode: [...NVDA, KeyCodes.R],
    modifiers: [Modifiers.Control],
    description:
      "Pressing once resets your configuration to when you last saved it. Pressing three times will reset it back to factory defaults.",
    representation: "NVDA-Control-R",
  },
  openConfigurationProfilesDialog: {
    keyCode: [...NVDA, KeyCodes.P],
    modifiers: [Modifiers.Control],
    description: "Show the Configuration Profiles dialog.",
    representation: "NVDA-Control-P",
  },

  // Misc

  moveToPrevious: {
    keyCode: KeyCodes.ArrowUp,
    modifiers: [],
    description: "Move to previous",
    representation: "Up Arrow",
  },
  moveToNext: {
    keyCode: KeyCodes.ArrowDown,
    modifiers: [],
    description: "Move to next",
    representation: "Down Arrow",
  },
  readNextFocusableItem: {
    keyCode: KeyCodes.Tab,
    modifiers: [],
    description: "Read next focusable item (e.g. link, button)",
    representation: "Tab",
  },
  performDefaultActionForItem: {
    keyCode: KeyCodes.Enter,
    modifiers: [],
    description: "Activate",
    representation: "Enter",
  },
  activate: {
    keyCode: KeyCodes.Enter,
    modifiers: [],
    description: "Activate",
    representation: "Enter",
  },
};
