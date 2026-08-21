import { activate } from "../activate";
import { base } from "../../debug";
import type { CommandOptions } from "../../CommandOptions";
import { ERR_PREFIX_SEND_KEYS } from "../errors";
import { isKeyCode } from "../../isKeyCode";
import { keyCode } from "../keyCode";
import type { KeyCodeCommand } from "../KeyCodeCommand";
import { keystroke } from "./keystroke";
import type { KeystrokeCommand } from "../KeystrokeCommand";

const debug = base.extend("sendKeys");

export async function sendKeys(
  keyCommand: KeyCodeCommand | KeystrokeCommand,
  applicationName?: string,
  options?: CommandOptions,
): Promise<void> {
  debug({ applicationName, keyCommand });

  if (applicationName) {
    await activate(applicationName);
  }

  try {
    return isKeyCode(keyCommand)
      ? await keyCode(keyCommand, options)
      : await keystroke(keyCommand, options);
  } catch (e) {
    throw new Error(
      `${ERR_PREFIX_SEND_KEYS}${
        applicationName ? `to application: ${applicationName}` : ""
      }\n${e.message}`,
      { cause: e },
    );
  }
}
