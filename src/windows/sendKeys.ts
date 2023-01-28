import { ERR_SEND_KEYS } from "./errors";
import { isKeyCode } from "../isKeyCode";
import type { KeyCodeCommand } from "./KeyCodeCommand";
import type { KeystrokeCommand } from "./KeystrokeCommand";
import { runVbsScript } from "./runVbsScript";

function getKeys(command: KeyCodeCommand | KeystrokeCommand): string {
  const characters = isKeyCode(command)
    ? Array.isArray(command.keyCode)
      ? command.keyCode.map((key) => key.symbol).join("")
      : command.keyCode.symbol
    : command.characters;

  const modifiers = (command.modifiers ?? []).map((modifier) => modifier.symbol).join();

  return `${modifiers}${characters}`;
}

export async function sendKeys(
  command: KeyCodeCommand | KeystrokeCommand
): Promise<void> {
  const keys = getKeys(command);

  const script = `set WshShell = CreateObject("WScript.Shell")\nWshShell.SendKeys "${keys}"`;

  try {
    await runVbsScript(script);
  } catch (e) {
    throw new Error(`${ERR_SEND_KEYS}\n${e.message}`);
  }
}
