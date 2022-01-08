import type { CommandOptions } from "../../CommandOptions";
import { runAppleScript } from "../runAppleScript";
import { withTransaction } from "../withTransaction";
import { retry } from "../../retry";
import { Applications } from "../Applications";
import { ERR_VOICE_OVER_GET_LAST_SPOKEN_PHRASE } from "../errors";

export async function getLastSpokenPhrase(
  options?: CommandOptions
): Promise<string> {
  const script = `tell application "${
    Applications.VOICE_OVER
  }"\n${withTransaction("return content of last phrase")}\nend tell`;

  try {
    return await retry(() => runAppleScript(script, options), options);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_GET_LAST_SPOKEN_PHRASE}\n${e.message}`);
  }
}
