import type { KeyCodeCommand } from "./KeyCodeCommand";
import type { KeystrokeCommand } from "./KeystrokeCommand";

export interface ScreenReader {
  start(): Promise<void>;
  stop(): Promise<void>;
  activate(applicationName: string): Promise<void>;
  keyCode(command: KeyCodeCommand): Promise<void>;
  keystroke(command: KeystrokeCommand): Promise<void>;
  getLastPhrase(): Promise<string>;
}
