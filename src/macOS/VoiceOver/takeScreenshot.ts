import type { CommandOptions } from "../../CommandOptions";
import { runAppleScript } from "../runAppleScript";
import { retry } from "../../retry";
import { withTransaction } from "../withTransaction";
import { Applications } from "../Applications";
import { ERR_VOICE_OVER_TAKE_SCREENSHOT } from "../errors";

export async function takeScreenshot(
  options?: CommandOptions
): Promise<string> {
  const script = `tell application "${
    Applications.VOICE_OVER
  }"\n${withTransaction("tell vo cursor to grab screenshot")}\nend tell`;

  try {
    return await retry(() => runAppleScript(script, options), options);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_TAKE_SCREENSHOT}\n${e.message}`);
  }
}
