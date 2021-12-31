import type { KeyCodeCommand } from "./KeyCodeCommand";

export const isKeyCode = (command: unknown): command is KeyCodeCommand =>
  typeof command === "object" && command !== null && "keyCode" in command;
