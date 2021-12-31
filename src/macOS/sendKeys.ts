import type { KeyCodeCommand } from "./KeyCodeCommand";
import type { KeystrokeCommand } from "./KeystrokeCommand";
import { Applications } from "./Applications";
import { keyCode } from "./keyCode";
import { keystroke } from "./keystroke";
import { isKeyCode } from "../isKeyCode";

export async function sendKeys(
  applicationName: Applications | string,
  keyCommand: KeyCodeCommand | KeystrokeCommand
): Promise<void> {
  if (isKeyCode(keyCommand)) {
    return await keyCode(applicationName, keyCommand);
  } else {
    return await keystroke(applicationName, keyCommand);
  }
}
