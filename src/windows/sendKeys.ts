import type { KeyCodeCommand } from "./KeyCodeCommand";
import type { KeystrokeCommand } from "./KeystrokeCommand";
import { runVbsCode } from "./runVbsCode";
import { isKeyCode } from "../isKeyCode";

function getKeys(command: KeyCodeCommand | KeystrokeCommand): string {
  const characters = isKeyCode(command) ? command.keyCode : command.characters;
  const modifiers = (command.modifiers ?? []).join("");

  return `${modifiers}${characters}`;
}

export async function sendKeys(
  command: KeyCodeCommand | KeystrokeCommand
): Promise<void> {
  const keys = getKeys(command);

  const script = `
  set WshShell = CreateObject("WScript.Shell")
  WshShell.SendKeys "${keys}";
  `;

  await runVbsCode(script);
}
