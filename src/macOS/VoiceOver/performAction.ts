import type { CommandOptions } from "../../options";
import { keyCode } from "../keyCode";
import { KeyCodes } from "../KeyCodes";
import { ERR_VOICE_OVER_PERFORM_ACTION } from "../errors";

export async function performAction(options?: CommandOptions): Promise<void> {
  try {
    return await keyCode({ keyCode: KeyCodes.KEY_ENTER }, options);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_PERFORM_ACTION}\n${e.message}`);
  }
}
