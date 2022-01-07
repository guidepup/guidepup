import type { CommandOptions } from "../../CommandOptions";
import type { ClickCount } from "./ClickCount";
import type { ClickButton } from "./ClickButton";
import { Applications } from "../Applications";
import { retryIfAppleEventTimeout } from "../retryIfAppleEventTimeout";
import { runAppleScript } from "../runAppleScript";
import { ERR_VOICE_OVER_CLICK } from "../errors";

export async function click(
  clickCount: ClickCount,
  clickButton?: ClickButton,
  options?: CommandOptions
): Promise<void> {
  const script = `tell application "${
    Applications.VOICE_OVER
  }"\ntell mouse cursor to click ${clickCount}${
    clickButton ? ` with ${clickButton}` : ""
  }\nend tell`;

  try {
    return await retryIfAppleEventTimeout(() => runAppleScript(script, options), options);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_CLICK}\n${e.message}`);
  }
}
