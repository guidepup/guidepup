import { Applications } from "./Applications";
import type { CommandOptions } from "../CommandOptions";
import type { KeyCodeCommand } from "./KeyCodeCommand";
import { retryIfAppleEventTimeout } from "./retryIfAppleEventTimeout";
import { runAppleScript } from "./runAppleScript";

export async function keyCode(
  { keyCode, modifiers = [] }: KeyCodeCommand,
  options?: CommandOptions
): Promise<void> {
  const script = `tell application "${Applications.SystemEvents}"\nkey code ${
    Array.isArray(keyCode) ? `{${keyCode.join(", ")}}` : keyCode
  }${modifiers.length ? ` using {${modifiers.join(", ")}}` : ""}\nend tell`;

  return await retryIfAppleEventTimeout(
    () => runAppleScript(script, options),
    options
  );
}
