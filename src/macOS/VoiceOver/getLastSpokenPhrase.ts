import { run } from "@jxa/run";
import { Applications } from "../Applications";
import { retry } from "../../retry";
import { ERR_VOICE_OVER_GET_LAST_SPOKEN_PHRASE } from "../errors";
import type { VoiceOver } from "@jxa/types";
import "@jxa/global-type";

export async function getLastSpokenPhrase(): Promise<string> {
  try {
    return await retry(
      run<string, Applications.VOICE_OVER>((name) => {
        const app = Application<VoiceOver.VoiceOver>(name);
        const lastPhrase =
          app.lastPhrase as unknown as VoiceOver.VoiceOver.LastPhraseObject;

        return lastPhrase.content();
      }, Applications.VOICE_OVER)
    );
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_GET_LAST_SPOKEN_PHRASE}\n${e.message}`);
  }
}
