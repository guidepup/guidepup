import { runAppleScript } from "../runAppleScript";
import { Directions } from "./Directions";
import { Containments } from "./Containments";
import { Places } from "./Places";
import { Applications } from "../Applications";
import { ERR_VOICE_OVER_MOVE } from "../errors";

export async function move(
  direction: Directions | Containments,
  place?: Places
): Promise<void> {
  const script = `tell application "${
    Applications.VOICE_OVER
  }"\ntell vo cursor to move ${direction}${
    place ? ` to ${place}` : ""
  }\nend tell`;

  try {
    return await runAppleScript(script);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_MOVE}\n${e.message}`);
  }
}
