import { Applications } from "../Applications";
import type { CommandOptions } from "../../CommandOptions";
import { ERR_VOICE_OVER_GET_LAST_SPOKEN_PHRASE } from "../errors";
import { retry } from "../../retry";
import { runAppleScript } from "../runAppleScript";
import { withTransaction } from "../withTransaction";

export async function lastSpokenPhrase(
  options?: CommandOptions
): Promise<string> {
  const script = `tell application "${
    Applications.VoiceOver
  }"\n${withTransaction("return content of last phrase")}\nend tell`;

  try {
    return await retry(() => runAppleScript(script, options), options);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_GET_LAST_SPOKEN_PHRASE}\n${e.message}`);
  }
}
