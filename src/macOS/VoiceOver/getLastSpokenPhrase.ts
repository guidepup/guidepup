import type { CommandOptions } from "../../CommandOptions";
import { runAppleScript } from "../runAppleScript";
import { Applications } from "../Applications";
import { retry } from "../../retry";
import { ERR_VOICE_OVER_GET_LAST_SPOKEN_PHRASE } from "../errors";

export async function getLastSpokenPhrase(
  options?: CommandOptions
): Promise<string> {
  const script = `tell application "${Applications.VOICE_OVER}"\nreturn content of last phrase\nend tell`;

  try {
    return await retry(() => runAppleScript(script, options), options);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_GET_LAST_SPOKEN_PHRASE}\n${e.message}`);
  }
}
