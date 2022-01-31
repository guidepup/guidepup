import type { CommandOptions } from "../CommandOptions";
import { ERR_PREFIX_ACTIVATE } from "./errors";
import { retryIfAppleEventTimeout } from "./retryIfAppleEventTimeout";
import { runAppleScript } from "./runAppleScript";
import { withTransaction } from "./withTransaction";

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
