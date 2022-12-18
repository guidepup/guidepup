import { Applications } from "../Applications";
import type { CommandOptions } from "../../CommandOptions";
import type { KeystrokeCommand } from "../KeystrokeCommand";
import { retryIfAppleEventTimeout } from "../retryIfAppleEventTimeout";
import { runAppleScript } from "../runAppleScript";
import { withModifiers } from "../withModifiers";

export async function keystroke(
  { characters, modifiers = [] }: KeystrokeCommand,
  options?: CommandOptions
): Promise<void> {
  const keystrokeCommand = `keystroke "${characters}"`;

  const script = `tell application "${
    Applications.SystemEvents
  }"\n${withModifiers(modifiers, keystrokeCommand)}\nend tell`;

  return await retryIfAppleEventTimeout(
    () => runAppleScript(script, options),
    options
  );
}
