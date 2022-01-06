import type { CommandOptions } from "../options";
import { runAppleScript } from "./runAppleScript";
import { Applications } from "./Applications";
import { ERR_PREFIX_ACTIVATE } from "./errors";

export async function activate(
  applicationName: Applications | string,
  options?: CommandOptions
): Promise<void> {
  const script = `tell application "${applicationName}"\nactivate\nend tell`;

  try {
    return await runAppleScript(script, options);
  } catch (e) {
    throw new Error(`${ERR_PREFIX_ACTIVATE}${applicationName}\n${e.message}`);
  }
}
