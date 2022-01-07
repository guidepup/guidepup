import type { CommandOptions } from "../../CommandOptions";
import type { KeystrokeCommand } from "../KeystrokeCommand";
import { retryIfAppleEventTimeout } from "../retryIfAppleEventTimeout";
import { runAppleScript } from "../runAppleScript";
import { Applications } from "../Applications";

export async function keystroke(
  { characters, modifiers = [] }: KeystrokeCommand,
  options?: CommandOptions
): Promise<void> {
  const script = `tell application "${
    Applications.SYSTEM_EVENTS
  }"\nkeystroke "${characters}"${
    modifiers.length ? ` using {${modifiers.join(", ")}}` : ""
  }\nend tell`;

  return await retryIfAppleEventTimeout(
    () => runAppleScript(script, options),
    options
  );
}
