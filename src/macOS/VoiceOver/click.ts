import { run } from "@jxa/run";
import { ClickCount } from "./ClickCount";
import { ClickButton } from "./ClickButton";
import { Applications } from "../Applications";
import { activate } from "../activate";
import "@jxa/global-type";

export async function click(
  clickCount: ClickCount,
  clickButton?: ClickButton
): Promise<void> {
  await activate(Applications.VOICE_OVER);

  const script = `tell application "VoiceOver"\ntell mouse cursor to click ${clickCount}${
    clickButton ? ` with ${clickButton}` : ""
  }\nend tell`;

  return await run<void, string>((appleScript) => {
    const app = Application.currentApplication();
    app.includeStandardAdditions = true;
    app.runScript(appleScript);
  }, script);
}
