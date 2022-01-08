import type { CommandOptions } from "../../CommandOptions";
import { runAppleScript } from "../runAppleScript";
import { waitForSaved } from "./waitForSaved";
import { retry } from "../../retry";
import { withTransaction } from "../withTransaction";
import { Applications } from "../Applications";
import { ERR_VOICE_OVER_SAVE_LAST_SPOKEN_PHRASE } from "../errors";

export async function saveLastSpokenPhrase(
  options?: CommandOptions
): Promise<void> {
  const script = `tell application "${
    Applications.VOICE_OVER
  }"\n${withTransaction("tell last phrase to save")}\nend tell`;

  try {
    await retry(() => runAppleScript(script, options), options);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_SAVE_LAST_SPOKEN_PHRASE}\n${e.message}`);
  }

  await waitForSaved(options);
}
