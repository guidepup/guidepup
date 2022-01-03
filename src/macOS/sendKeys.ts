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
  return isKeyCode(keyCommand)
    ? await keyCode(applicationName, keyCommand)
    : await keystroke(applicationName, keyCommand);
}
