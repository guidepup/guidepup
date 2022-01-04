import { runAppleScript } from "../runAppleScript";
import { Applications } from "../Applications";
import { waitForSaved } from "./waitForSaved";
import { retry } from "../../retry";
import { ERR_VOICE_OVER_SAVE_LAST_SPOKEN_PHRASE } from "../errors";

export async function saveLastSpokenPhrase(): Promise<void> {
  const script = `tell application "${Applications.VOICE_OVER}"\ntell last phrase to save\nend tell`;

  try {
    return await retry(() => runAppleScript(script));
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_SAVE_LAST_SPOKEN_PHRASE}\n${e.message}`);
  }

  await waitForSaved();
}
