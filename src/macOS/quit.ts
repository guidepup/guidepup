import type { CommandOptions } from "../CommandOptions";
import { retryIfAppleEventTimeout } from "./retryIfAppleEventTimeout";
import { runAppleScript } from "./runAppleScript";
import { Applications } from "./Applications";
import { ERR_PREFIX_QUIT } from "./errors";

export async function quit(
  applicationName: Applications,
  options?: CommandOptions
): Promise<void> {
  const script = `tell application "${applicationName}"\nquit\nend tell`;

  try {
    return await retryIfAppleEventTimeout(
      () => runAppleScript(script, options),
      options
    );
  } catch (e) {
    throw new Error(`${ERR_PREFIX_QUIT}${applicationName}\n${e.message}`);
  }
}
