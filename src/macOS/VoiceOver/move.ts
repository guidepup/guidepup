import { Applications } from "../Applications";
import type { CommandOptions } from "../../CommandOptions";
import type { Containments } from "./Containments";
import type { Directions } from "./Directions";
import { ERR_VOICE_OVER_MOVE } from "../errors";
import type { Places } from "./Places";
import { retryIfAppleEventTimeout } from "../retryIfAppleEventTimeout";
import { runAppleScript } from "../runAppleScript";
import { withTransaction } from "../withTransaction";

export async function move(
  direction: Directions | Containments,
  place?: Places,
  options?: CommandOptions
): Promise<void> {
  const moveScript = `tell vo cursor to move ${direction}${
    place ? ` to ${place}` : ""
  }`;

  const script = `tell application "${
    Applications.VoiceOver
  }"\n${withTransaction(moveScript)}\nend tell`;

  try {
    return await retryIfAppleEventTimeout(
      () => runAppleScript(script, options),
      options
    );
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_MOVE}\n${e.message}`);
  }
}
