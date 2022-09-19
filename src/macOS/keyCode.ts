import { Applications } from "./Applications";
import type { CommandOptions } from "../CommandOptions";
import type { KeyCodeCommand } from "./KeyCodeCommand";
import { retryIfAppleEventTimeout } from "./retryIfAppleEventTimeout";
import { runAppleScript } from "./runAppleScript";
import { withModifiers } from "./withModifiers";

export async function keyCode(
  { keyCode, modifiers = [] }: KeyCodeCommand,
  options?: CommandOptions
): Promise<void> {
  const keyCodeCommand = `key code ${
    Array.isArray(keyCode) ? `{${keyCode.join(", ")}}` : keyCode
  }`;

  const script = `tell application "${
    Applications.SystemEvents
  }"\n${withModifiers(modifiers, keyCodeCommand)}\nend tell`;

  return await retryIfAppleEventTimeout(
    () => runAppleScript(script, options),
    options
  );
}
