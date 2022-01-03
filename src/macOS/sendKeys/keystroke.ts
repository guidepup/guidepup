import { run } from "@jxa/run";
import { Applications } from "../Applications";
import { KeystrokeCommand } from "../KeystrokeCommand";
import "@jxa/global-type";

export async function keystroke(command: KeystrokeCommand): Promise<void> {
  return await run<void, Applications.SYSTEM_EVENTS, KeystrokeCommand>(
    (name, { characters, modifiers = [] }) =>
      Application(name).keystroke(characters, { using: modifiers }),
    Applications.SYSTEM_EVENTS,
    command
  );
}
