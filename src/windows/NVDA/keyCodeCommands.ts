import { KeyCodes } from "../KeyCodes";
import { Modifiers } from "../Modifiers";

export const keyCodeCommands = {
  turnNvdaOn: {
    keyCode: KeyCodes.KeyN,
    modifiers: [Modifiers.CONTROL, Modifiers.ALT],
    description: "Turn NVDA on",
    representation: "Control-Alt-N",
  },
  turnNvdaOff: {
    keyCode: [KeyCodes.Insert, KeyCodes.KeyQ],
    description: "Turn NVDA off",
    representation: "Insert-Q",
  },
  moveToPrevious: {
    keyCode: KeyCodes.ArrowUp,
    description: "Move to previous",
    representation: "Up Arrow",
  },
  moveToNext: {
    keyCode: KeyCodes.ArrowDown,
    description: "Move to next",
    representation: "Down Arrow",
  },
  stopReading: {
    keyCode: KeyCodes.Control,
    description: "Stop reading",
    representation: "Control",
  },
  performDefaultActionForItem: {
    keyCode: KeyCodes.Enter,
    description: "Activate",
    representation: "Enter",
  },
  activate: {
    keyCode: KeyCodes.Enter,
    description: "Activate",
    representation: "Enter",
  },
};
