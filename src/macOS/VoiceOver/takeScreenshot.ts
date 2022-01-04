import { run } from "@jxa/run";
import { Applications } from "../Applications";
import { retry } from "../../retry";
import { ERR_VOICE_OVER_TAKE_SCREENSHOT } from "../errors";
import type { VoiceOver } from "@jxa/types";
import "@jxa/global-type";

interface VoCursorObject {
  grabScreenshot(): string;
}

export async function takeScreenshot(): Promise<string> {
  try {
    return await retry(() =>
      run<string, Applications.VOICE_OVER>((name) => {
        const app = Application<VoiceOver.VoiceOver>(name);
        const voCursor = app.voCursor as unknown as VoCursorObject;

        return voCursor.grabScreenshot();
      }, Applications.VOICE_OVER)
    );
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_TAKE_SCREENSHOT}\n${e.message}`);
  }
}
