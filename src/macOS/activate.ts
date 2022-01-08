import type { CommandOptions } from "../CommandOptions";
import { retryIfAppleEventTimeout } from "./retryIfAppleEventTimeout";
import { runAppleScript } from "./runAppleScript";
import { withTransaction } from "./withTransaction";
import { Applications } from "./Applications";
import { ERR_PREFIX_ACTIVATE } from "./errors";

export async function activate(
  applicationName: Applications | string,
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
