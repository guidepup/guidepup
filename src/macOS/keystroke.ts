import { run } from "@jxa/run";
import { Applications } from "./Applications";
import { activate } from "./activate";
import { KeystrokeCommand } from "./KeystrokeCommand";
import "@jxa/global-type";

export async function keystroke(
  applicationName: Applications | string,
  command: KeystrokeCommand
): Promise<void> {
  await activate(applicationName);

  return await run<void, Applications.SYSTEM_EVENTS, KeystrokeCommand>(
    (name, { characters, modifiers = [] }) => {
      const app = Application(name);

      return app.keystroke(characters, { using: modifiers });
    },
    Applications.SYSTEM_EVENTS,
    command
  );
}
