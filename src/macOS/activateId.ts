import { base } from "../debug";
import type { CommandOptions } from "../CommandOptions";
import { ERR_PREFIX_ACTIVATE_ID } from "./errors";
import { retryIfAppleEventTimeout } from "./retryIfAppleEventTimeout";
import { runAppleScript } from "./runAppleScript";
import { withTransaction } from "./withTransaction";

const debug = base.extend("activateId");

/**
 * Opens a MacOS application by ID, if not already open, and focuses the application.
 *
 * ```ts
 * import { macOSActivateId } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Opens the example application if not already open, and focuses the window.
 *   await macOSActivateId("org.example.application");
 * })();
 * ```
 *
 * @param {string} applicationId Application identifier.
 * @param {object} options Additional options.
 */
export async function activateId(
  applicationId: string,
  options?: CommandOptions,
): Promise<void> {
  debug(applicationId);

  const script = `tell application id "${applicationId}"\n${withTransaction(
    "activate",
  )}\nend tell`;

  try {
    return await retryIfAppleEventTimeout(
      () => runAppleScript(script, options),
      options,
    );
  } catch (cause) {
    throw new Error(`${ERR_PREFIX_ACTIVATE_ID}${applicationId}`, {
      cause,
    });
  }
}
