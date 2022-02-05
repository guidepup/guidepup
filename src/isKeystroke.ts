import type { KeystrokeCommand } from "./KeystrokeCommand";

export const isKeystroke = (command: unknown): command is KeystrokeCommand =>
  typeof command === "object" && command !== null && "characters" in command;
