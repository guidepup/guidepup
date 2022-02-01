import { Applications } from "../Applications";
import type { CommandOptions } from "../../CommandOptions";
import { ERR_VOICE_OVER_COPY_LAST_SPOKEN_PHRASE } from "../errors";
import { retry } from "../../retry";
import { runAppleScript } from "../runAppleScript";
import { withTransaction } from "../withTransaction";

export async function copyLastSpokenPhrase(
  options?: CommandOptions
): Promise<void> {
  const script = `tell application "${
    Applications.VoiceOver
  }"\n${withTransaction("tell last phrase to copy to pasteboard"
  )}\nend tell`;

  try {
    return await retry(() => runAppleScript(script, options), options);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_COPY_LAST_SPOKEN_PHRASE}\n${e.message}`);
  }
}
