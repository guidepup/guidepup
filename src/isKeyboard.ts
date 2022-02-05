import { isKeyCode } from "./isKeyCode";
import { isKeystroke } from "./isKeystroke";
import { KeyboardCommand } from "./macOS/KeyboardCommand";

export const isKeyboard = (command: unknown): command is KeyboardCommand => {
  return isKeyCode(command) || isKeystroke(command);
};
