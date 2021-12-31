import { run } from "@jxa/run";
import { Applications } from "../Applications";
import type { VoiceOver } from "@jxa/types";
import "@jxa/global-type";

interface VoCursorObject {
  grabScreenshot(): string;
}

export async function takeScreenshot(): Promise<string> {
  return await run<string, Applications.VOICE_OVER>((name) => {
    const app = Application<VoiceOver.VoiceOver>(name);
    const voCursor = app.voCursor as unknown as VoCursorObject;

    return voCursor.grabScreenshot();
  }, Applications.VOICE_OVER);
}
