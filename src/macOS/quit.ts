import type { Options } from "./types";
import { runAppleScript } from "./runAppleScript";
import { Applications } from "./Applications";
import { ERR_PREFIX_QUIT } from "./errors";

export async function quit(
  applicationName: Applications,
  options?: Options
): Promise<void> {
  const script = `tell application "${applicationName}"\nquit\nend tell`;

  try {
    return await runAppleScript(script, options);
  } catch (e) {
    throw new Error(`${ERR_PREFIX_QUIT}${applicationName}\n${e.message}`);
  }
}
