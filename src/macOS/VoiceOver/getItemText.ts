import type { CommandOptions } from "../../CommandOptions";
import { runAppleScript } from "../runAppleScript";
import { Applications } from "../Applications";
import { retry } from "../../retry";
import { ERR_VOICE_OVER_GET_ITEM_TEXT } from "../errors";

export async function getItemText(options?: CommandOptions): Promise<string> {
  const script = `tell application "${Applications.VOICE_OVER}"\nreturn text under cursor of vo cursor\nend tell`;

  try {
    return await retry(() => runAppleScript(script, options), options);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_GET_ITEM_TEXT}\n${e.message}`);
  }
}
