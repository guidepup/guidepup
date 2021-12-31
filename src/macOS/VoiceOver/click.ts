import { runAppleScript } from "../runAppleScript";
import { ClickCount } from "./ClickCount";
import { ClickButton } from "./ClickButton";
import { Applications } from "../Applications";

export async function click(
  clickCount: ClickCount,
  clickButton?: ClickButton
): Promise<void> {
  const script = `tell application "${
    Applications.VOICE_OVER
  }"\ntell mouse cursor to click ${clickCount}${
    clickButton ? ` with ${clickButton}` : ""
  }\nend tell`;

  return await runAppleScript(script);
}
