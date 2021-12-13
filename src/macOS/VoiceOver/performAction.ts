import { run } from "@jxa/run";
import { Applications } from "../Applications";
import { activate } from "../activate";
import type { VoiceOver } from "@jxa/types";
import "@jxa/global-type";

export async function performAction(): Promise<void> {
  await activate(Applications.VOICE_OVER);

  return await run<void, Applications.VOICE_OVER>((name) => {
    const app = Application<VoiceOver.VoiceOver>(name);
    const voCursor =
      app.voCursor as unknown as VoiceOver.VoiceOver.VoCursorObject;

    return app.performAction(voCursor);
  }, Applications.VOICE_OVER);
}
