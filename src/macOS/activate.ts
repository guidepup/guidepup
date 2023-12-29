import type { CommandOptions } from "../CommandOptions";
import { ERR_PREFIX_ACTIVATE } from "./errors";
import { retryIfAppleEventTimeout } from "./retryIfAppleEventTimeout";
import { runAppleScript } from "./runAppleScript";
import { withTransaction } from "./withTransaction";

/**
 * [API Reference](https://www.guidepup.dev/docs/api/class-macos-activate)
 *
 * Opens a MacOS application if not already open, and focuses the application.
 *
 * ```ts
 * import { macOSActivate, MacOSApplications } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Opens Safari if not already open, and focuses the window.
 *   await macOSActivate(MacOSApplications.Safari);
 * })();
 * ```
 *
 * @param {string} applicationName Application identifier. See [MacOSApplications](https://www.guidepup.dev/docs/api/class-macos-applications).
 * @param {object} options Additional options.
 */
export async function activate(
  applicationName: string,
  options?: CommandOptions
): Promise<void> {
  const script = `tell application "${applicationName}"\n${withTransaction(
    "activate"
  )}\nend tell`;

  try {
    return await retryIfAppleEventTimeout(
      () => runAppleScript(script, options),
      options
    );
  } catch (e) {
    throw new Error(`${ERR_PREFIX_ACTIVATE}${applicationName}\n${e.message}`);
  }
}
