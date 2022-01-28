import type { KeyCodeCommand } from "../KeyCodeCommand";
import type { KeystrokeCommand } from "../KeystrokeCommand";
import type { CommandOptions } from "../../CommandOptions";
import { activate } from "../activate";
import { keyCode } from "../keyCode";
import { keystroke } from "./keystroke";
import { isKeyCode } from "../../isKeyCode";
import { ERR_PREFIX_SEND_KEYS } from "../errors";

export async function sendKeys(
  applicationName: string,
  keyCommand: KeyCodeCommand | KeystrokeCommand,
  options?: CommandOptions
): Promise<void> {
  await activate(applicationName);

  try {
    return isKeyCode(keyCommand)
      ? await keyCode(keyCommand, options)
      : await keystroke(keyCommand, options);
  } catch (e) {
    throw new Error(`${ERR_PREFIX_SEND_KEYS}${applicationName}\n${e.message}`);
  }
}
