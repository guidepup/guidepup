import type { CommandOptions } from "../CommandOptions";
import { ERR_PREFIX_QUIT } from "./errors";
import { retryIfAppleEventTimeout } from "./retryIfAppleEventTimeout";
import { runAppleScript } from "./runAppleScript";
import { withTransaction } from "./withTransaction";

/**
 * [API Reference](https://www.guidepup.dev/docs/api/class-macos-quit)
 *
 * Quits a MacOS application if running.
 *
 * ```ts
 * import {
 *   macOSActivate,
 *   macOSQuit,
 *   MacOSApplications,
 * } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Open Safari.
 *   await macOSActivate(MacOSApplications.Safari);
 *
 *   // ... perform some commands.
 *
 *   // Quits Safari.
 *   await macOSQuit(MacOSApplications.Safari);
 * })();
 * ```
 *
 * @param {string} applicationName Application identifier. See [MacOSApplications](https://www.guidepup.dev/docs/api/class-macos-applications).
 * @param {object} options Additional options.
 */
export async function quit(
  applicationName: string,
  options?: CommandOptions
): Promise<void> {
  const script = `tell application "${applicationName}"\n${withTransaction(
    "quit"
  )}\nend tell`;

  try {
    return await retryIfAppleEventTimeout(
      () => runAppleScript(script, options),
      options
    );
  } catch (e) {
    throw new Error(`${ERR_PREFIX_QUIT}${applicationName}\n${e.message}`);
  }
}
