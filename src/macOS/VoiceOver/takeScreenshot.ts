import type { RetryableCommandOptions } from "../../options";
import { runAppleScript } from "../runAppleScript";
import { Applications } from "../Applications";
import { retry } from "../../retry";
import { ERR_VOICE_OVER_TAKE_SCREENSHOT } from "../errors";

export async function takeScreenshot(
  options?: RetryableCommandOptions
): Promise<string> {
  const script = `tell application "${Applications.VOICE_OVER}"\ntell vo cursor to grab screenshot\nend tell`;

  try {
    return await retry(() => runAppleScript(script, options), options);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_TAKE_SCREENSHOT}\n${e.message}`);
  }
}
