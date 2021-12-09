import { run } from "@jxa/run";
import { Applications } from "./Applications";
import { activate } from "./activate";
import type { KeyCodeCommand } from "../KeyCodeCommand";
import "@jxa/global-type";

export async function keyCode(
  applicationName: Applications | string,
  command: KeyCodeCommand
): Promise<void> {
  await activate(applicationName);

  return await run<void, Applications.SYSTEM_EVENTS, KeyCodeCommand>(
    (name, { keyCode, modifiers = [] }) => {
      const app = Application(name);

      return app.keyCode(keyCode, { using: modifiers });
    },
    Applications.SYSTEM_EVENTS,
    command
  );
}
