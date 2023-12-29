import type { KeyCodeCommand } from "./KeyCodeCommand";
import type { KeystrokeCommand } from "./KeystrokeCommand";

/**
 * A MacOS keyboard command.
 */
export type KeyboardCommand = KeyCodeCommand | KeystrokeCommand;
