import { Applications } from "../Applications";
import type { CommandOptions } from "../../CommandOptions";
import { ERR_VOICE_OVER_SAVE_LAST_SPOKEN_PHRASE } from "../errors";
import { retry } from "../../retry";
import { runAppleScript } from "../runAppleScript";
import { waitForSaved } from "./waitForSaved";
import { withTransaction } from "../withTransaction";

export async function saveLastSpokenPhrase(
  options?: CommandOptions
): Promise<void> {
  const script = `tell application "${
    Applications.VoiceOver
  }"\n${withTransaction("tell last phrase to save")}\nend tell`;

  try {
    await retry(() => runAppleScript(script, options), options);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_SAVE_LAST_SPOKEN_PHRASE}\n${e.message}`);
  }

  await waitForSaved(options);
}
