import { run } from "@jxa/run";
import { Applications } from "../Applications";
import "@jxa/global-type";
import type { VoiceOver } from "@jxa/types";

export async function getLastSpokenPhrase(): Promise<string> {
  return await run<string, Applications.VOICE_OVER>((name) => {
    const app = Application<VoiceOver.VoiceOver>(name);
    const lastPhrase =
      app.lastPhrase as unknown as VoiceOver.VoiceOver.LastPhraseObject;

    return lastPhrase.content();
  }, Applications.VOICE_OVER);
}
