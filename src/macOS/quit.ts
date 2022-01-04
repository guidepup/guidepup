import { runAppleScript } from "./runAppleScript";
import { Applications } from "./Applications";
import { ERR_PREFIX_QUIT } from "./errors";

export async function quit(applicationName: Applications): Promise<void> {
  const script = `tell application "${applicationName}"\nquit\nend tell`;

  try {
    return await runAppleScript(script);
  } catch (e) {
    throw new Error(`${ERR_PREFIX_QUIT}${applicationName}\n${e.message}`);
  }
}
