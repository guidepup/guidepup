import type { KeyCodeCommand } from "./KeyCodeCommand";
import type { KeystrokeCommand } from "./KeystrokeCommand";

/**
 * A macOS keyboard command.
 */
export type KeyboardCommand = KeyCodeCommand | KeystrokeCommand;
