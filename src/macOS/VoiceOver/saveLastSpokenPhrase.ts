import { run } from "@jxa/run";
import { Applications } from "../Applications";
import { VoiceOver } from "@jxa/types";
import { activate } from "../activate";
import { waitForSaved } from "./waitForSaved";
import "@jxa/global-type";

export async function saveLastSpokenPhrase(): Promise<void> {
  await activate(Applications.VOICE_OVER);

  await run<void, Applications.VOICE_OVER>((name) => {
    const app = Application<VoiceOver.VoiceOver>(name);
    const lastPhrase =
      app.lastPhrase as unknown as VoiceOver.VoiceOver.LastPhraseObject;

    app.save(lastPhrase);
  }, Applications.VOICE_OVER);

  await waitForSaved();
}
