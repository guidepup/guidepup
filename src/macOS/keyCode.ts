import { run } from "@jxa/run";
import { Applications } from "./Applications";
import type { KeyCodeCommand } from "./KeyCodeCommand";
import "@jxa/global-type";

export async function keyCode(command: KeyCodeCommand): Promise<void> {
  return await run<void, Applications.SYSTEM_EVENTS, KeyCodeCommand>(
    (name, { keyCode, modifiers = [] }) =>
      Application(name).keyCode(keyCode, { using: modifiers }),
    Applications.SYSTEM_EVENTS,
    command
  );
}
