import type { CommandOptions } from "../CommandOptions";
import { ERR_PREFIX_QUIT } from "./errors";
import { retryIfAppleEventTimeout } from "./retryIfAppleEventTimeout";
import { runAppleScript } from "./runAppleScript";
import { withTransaction } from "./withTransaction";

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
