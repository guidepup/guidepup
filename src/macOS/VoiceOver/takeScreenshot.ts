import { Applications } from "../Applications";
import type { CommandOptions } from "../../CommandOptions";
import { ERR_VOICE_OVER_TAKE_SCREENSHOT } from "../errors";
import { retry } from "../../retry";
import { runAppleScript } from "../runAppleScript";
import { withTransaction } from "../withTransaction";

export async function takeScreenshot(
  options?: CommandOptions
): Promise<string> {
  const script = `tell application "${
    Applications.VoiceOver
  }"\n${withTransaction("tell vo cursor to grab screenshot")}\nend tell`;

  try {
    return await retry(() => runAppleScript(script, options), options);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_TAKE_SCREENSHOT}\n${e.message}`);
  }
}
