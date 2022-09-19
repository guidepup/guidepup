import { Applications } from "./Applications";
import type { CommandOptions } from "../CommandOptions";
import { retryIfAppleEventTimeout } from "./retryIfAppleEventTimeout";
import { runAppleScript } from "./runAppleScript";

export async function getDimensions(options?: CommandOptions): Promise<string> {
  const script = `tell application "${Applications.Finder}" to get bounds of window of desktop`;

  try {
    return await retryIfAppleEventTimeout(
      () => runAppleScript(script, options),
      options
    );
  } catch (_) {
    return "";
  }
}
