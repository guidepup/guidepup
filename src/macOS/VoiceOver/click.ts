import type { Options } from "../types";
import type { ClickCount } from "./ClickCount";
import type { ClickButton } from "./ClickButton";
import { Applications } from "../Applications";
import { runAppleScript } from "../runAppleScript";
import { ERR_VOICE_OVER_CLICK } from "../errors";

export async function click(
  clickCount: ClickCount,
  clickButton?: ClickButton,
  options?: Options
): Promise<void> {
  const script = `tell application "${
    Applications.VOICE_OVER
  }"\ntell mouse cursor to click ${clickCount}${
    clickButton ? ` with ${clickButton}` : ""
  }\nend tell`;

  try {
    return await runAppleScript(script, options);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_CLICK}\n${e.message}`);
  }
}
