import { runAppleScript } from "./runAppleScript";
import { Applications } from "./Applications";
import type { KeyCodeCommand } from "./KeyCodeCommand";

export async function keyCode({
  keyCode,
  modifiers = [],
}: KeyCodeCommand): Promise<void> {
  const script = `tell application "${Applications.SYSTEM_EVENTS}"\nkey code ${
    Array.isArray(keyCode) ? `{${keyCode.join(", ")}}` : keyCode
  }${modifiers.length ? ` using {${modifiers.join(", ")}}` : ""}\nend tell`;

  return await runAppleScript(script);
}
