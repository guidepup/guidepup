import { runAppleScript } from "../runAppleScript";
import { ClickCount } from "./ClickCount";
import { ClickButton } from "./ClickButton";
import { Applications } from "../Applications";
import { ERR_VOICE_OVER_CLICK } from "../errors";

export async function click(
  clickCount: ClickCount,
  clickButton?: ClickButton
): Promise<void> {
  const script = `tell application "${
    Applications.VOICE_OVER
  }"\ntell mouse cursor to click ${clickCount}${
    clickButton ? ` with ${clickButton}` : ""
  }\nend tell`;

  try {
    return await runAppleScript(script);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_CLICK}\n${e.message}`);
  }
}
