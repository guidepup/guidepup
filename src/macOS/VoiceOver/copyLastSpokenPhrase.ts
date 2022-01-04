import { run } from "@jxa/run";
import { Applications } from "../Applications";
import { retry } from "../../retry";
import { ERR_VOICE_OVER_COPY_LAST_SPOKEN_PHRASE } from "../errors";
import type { VoiceOver } from "@jxa/types";
import "@jxa/global-type";

export async function copyLastSpokenPhrase(): Promise<void> {
  try {
    return await retry(
      run<void, Applications.VOICE_OVER>((name) => {
        const app = Application<VoiceOver.VoiceOver>(name);
        const lastPhrase =
          app.lastPhrase as unknown as VoiceOver.VoiceOver.LastPhraseObject;

        return app.copyToPasteboard(lastPhrase);
      }, Applications.VOICE_OVER)
    );
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_COPY_LAST_SPOKEN_PHRASE}\n${e.message}`);
  }
}
