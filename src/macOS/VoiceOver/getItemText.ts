import { run } from "@jxa/run";
import { Applications } from "../Applications";
import { retry } from "../../retry";
import { ERR_VOICE_OVER_GET_ITEM_TEXT } from "../errors";
import type { VoiceOver } from "@jxa/types";
import "@jxa/global-type";

export async function getItemText(): Promise<string> {
  try {
    return await retry(
      run<string, Applications.VOICE_OVER>((name) => {
        const app = Application<VoiceOver.VoiceOver>(name);
        const voCursor =
          app.voCursor as unknown as VoiceOver.VoiceOver.VoCursorObject;

        return voCursor.textUnderCursor();
      }, Applications.VOICE_OVER)
    );
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_GET_ITEM_TEXT}\n${e.message}`);
  }
}
