import type { CommandOptions } from "../../CommandOptions";
import { runAppleScript } from "../runAppleScript";
import { withTransaction } from "../withTransaction";
import { retry } from "../../retry";
import { Applications } from "../Applications";
import { ERR_VOICE_OVER_COPY_LAST_SPOKEN_PHRASE } from "../errors";

export async function copyLastSpokenPhrase(
  options?: CommandOptions
): Promise<void> {
  const script = `tell application "${
    Applications.VOICE_OVER
  }"\n${withTransaction("tell last phrase to copy to pasteboard"
  )}\nend tell`;

  try {
    return await retry(() => runAppleScript(script, options), options);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_COPY_LAST_SPOKEN_PHRASE}\n${e.message}`);
  }
}
