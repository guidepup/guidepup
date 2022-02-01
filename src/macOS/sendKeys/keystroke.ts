import { Applications } from "../Applications";
import type { CommandOptions } from "../../CommandOptions";
import type { KeystrokeCommand } from "../KeystrokeCommand";
import { retryIfAppleEventTimeout } from "../retryIfAppleEventTimeout";
import { runAppleScript } from "../runAppleScript";

export async function keystroke(
  { characters, modifiers = [] }: KeystrokeCommand,
  options?: CommandOptions
): Promise<void> {
  const script = `tell application "${
    Applications.SystemEvents
  }"\nkeystroke "${characters}"${
    modifiers.length ? ` using {${modifiers.join(", ")}}` : ""
  }\nend tell`;

  return await retryIfAppleEventTimeout(
    () => runAppleScript(script, options),
    options
  );
}
