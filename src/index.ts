export * from "./macOS";
export * from "./windows";
export type { ClickOptions } from "./ClickOptions";
export type { CommandOptions } from "./CommandOptions";
export type { KeyboardCommand } from "./KeyboardCommand";
export type { KeyboardOptions } from "./KeyboardOptions";
export type { KeyCodeCommand } from "./KeyCodeCommand";
export type { KeystrokeCommand } from "./KeystrokeCommand";
export type { IScreenReader } from "./IScreenReader";

import { ScreenReader } from "./ScreenReader";

/**
 * This object can be used to launch and control the default screen reader for
 * the environment.
 *
 * Here's a typical example:
 *
 * ```ts
 * import { screenReader } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Start the screen reader.
 *   await screenReader.start();
 *
 *   // Move to the next item.
 *   await screenReader.next();
 *
 *   // ... perform some commands.
 *
 *   // Stop the screen reader.
 *   await screenReader.stop();
 * })();
 * ```
 */
export const screenReader = new ScreenReader();

/**
 * This object can be used to launch and control the default screen reader for
 * the environment.
 *
 * Here's a typical example:
 *
 * ```ts
 * import { screenReader } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Start the screen reader.
 *   await screenReader.start();
 *
 *   // Move to the next item.
 *   await screenReader.next();
 *
 *   // ... perform some commands.
 *
 *   // Stop the screen reader.
 *   await screenReader.stop();
 * })();
 * ```
 */
type _ScreenReader = typeof screenReader;

export { _ScreenReader as ScreenReader };
