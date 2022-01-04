import { runAppleScript } from "../runAppleScript";
import { Applications } from "../Applications";
import { KeystrokeCommand } from "../KeystrokeCommand";

export async function keystroke({
  characters,
  modifiers = [],
}: KeystrokeCommand): Promise<void> {
  const script = `tell application "${
    Applications.SYSTEM_EVENTS
  }"\nkeystroke "${characters}"${
    modifiers.length ? ` using {${modifiers.join(", ")}}` : ""
  }\nend tell`;

  return await runAppleScript(script);
}
