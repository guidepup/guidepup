import type { Directions } from "./Directions";
import type { Containments } from "./Containments";
import type { Places } from "./Places";
import type { Options } from "../types";
import { runAppleScript } from "../runAppleScript";
import { Applications } from "../Applications";
import { ERR_VOICE_OVER_MOVE } from "../errors";

export async function move(
  direction: Directions | Containments,
  place?: Places,
  options?: Options
): Promise<void> {
  const script = `tell application "${
    Applications.VOICE_OVER
  }"\ntell vo cursor to move ${direction}${
    place ? ` to ${place}` : ""
  }\nend tell`;

  try {
    return await runAppleScript(script, options);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_MOVE}\n${e.message}`);
  }
}
