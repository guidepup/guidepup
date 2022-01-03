import { run } from "@jxa/run";
import { Applications } from "../Applications";
import { waitForSaved } from "./waitForSaved";
import { ERR_VOICE_OVER_SAVE_LAST_SPOKEN_PHRASE } from "../errors";
import type { VoiceOver } from "@jxa/types";
import "@jxa/global-type";

export async function saveLastSpokenPhrase(): Promise<void> {
  try {
    await run<void, Applications.VOICE_OVER>((name) => {
      const app = Application<VoiceOver.VoiceOver>(name);
      const lastPhrase =
        app.lastPhrase as unknown as VoiceOver.VoiceOver.LastPhraseObject;

      app.save(lastPhrase);
    }, Applications.VOICE_OVER);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_SAVE_LAST_SPOKEN_PHRASE}\n${e.message}`);
  }

  await waitForSaved();
}
