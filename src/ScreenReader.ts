import type { KeyCodeCommand } from "./KeyCodeCommand";
import type { KeystrokeCommand } from "./KeystrokeCommand";

interface ScreenReaderBase {
  start(): Promise<void>;
  stop(): Promise<void>;
  activate(applicationName: string): Promise<void>;
  keyCode(command: KeyCodeCommand): Promise<void>;
  keystroke(command: KeystrokeCommand): Promise<void>;
  moveUp(): Promise<void>;
  moveRight(): Promise<void>;
  moveDown(): Promise<void>;
  moveLeft(): Promise<void>;
  click(): Promise<void>;
  doubleClick(): Promise<void>;
  tripleClick(): Promise<void>;
  rightClick(): Promise<void>;
  rightDoubleClick(): Promise<void>;
  rightTripleClick(): Promise<void>;
  getLastSpokenPhrase(): Promise<string>;
  getText(): Promise<string>;
}

export interface ScreenReader {
  new (): ScreenReaderBase;
  detect(): boolean;
  default(): boolean;
}
