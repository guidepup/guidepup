import { Applications } from "../Applications";
import type { CommandOptions } from "../../CommandOptions";
import { ERR_VOICE_OVER_PERFORM_ACTION } from "../errors";
import { retryIfAppleEventTimeout } from "../retryIfAppleEventTimeout";
import { runAppleScript } from "../runAppleScript";
import { withTransaction } from "../withTransaction";

export async function performAction(options?: CommandOptions): Promise<void> {
  const actionScript = `tell vo cursor to perform action`;

  const script = `tell application "${
    Applications.VoiceOver
  }"\n${withTransaction(actionScript)}\nend tell`;

  try {
    return await retryIfAppleEventTimeout(
      () => runAppleScript(script, options),
      options
    );
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_PERFORM_ACTION}\n${e.message}`);
  }
}
