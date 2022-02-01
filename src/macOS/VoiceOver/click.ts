import { DEFAULT_CLICK_BUTTON, DEFAULT_CLICK_COUNT } from "../../constants";
import { Applications } from "../Applications";
import { ClickButton } from "./ClickButton";
import { ClickCount } from "./ClickCount";
import type { ClickOptions } from "../../ClickOptions";
import { ERR_VOICE_OVER_CLICK } from "../errors";
import { retryIfAppleEventTimeout } from "../retryIfAppleEventTimeout";
import { runAppleScript } from "../runAppleScript";
import { withTransaction } from "../withTransaction";

const buttonMap = {
  left: ClickButton.Left,
  right: ClickButton.Right,
};

const clickCountMap = {
  1: ClickCount.Once,
  2: ClickCount.Twice,
  3: ClickCount.Thrice,
};

export async function click(
  {
    button = DEFAULT_CLICK_BUTTON,
    clickCount = DEFAULT_CLICK_COUNT,
    ...options
  }: ClickOptions = {
    button: DEFAULT_CLICK_BUTTON,
    clickCount: DEFAULT_CLICK_COUNT,
  }
): Promise<void> {
  const mappedButton = buttonMap[button];
  const mappedClickCount = clickCountMap[clickCount];

  const clickScript = `tell mouse cursor to click ${mappedClickCount} with ${mappedButton}`;

  const script = `tell application "${
    Applications.VoiceOver
  }"\n${withTransaction(clickScript)}\nend tell`;

  try {
    return await retryIfAppleEventTimeout(
      () => runAppleScript(script, options),
      options
    );
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_CLICK}\n${e.message}`);
  }
}
