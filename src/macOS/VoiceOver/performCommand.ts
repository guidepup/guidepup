import { run } from "@jxa/run";
import { CommanderCommands } from "./CommanderCommands";
import { Applications } from "../Applications";
import { activate } from "../activate";
import "@jxa/global-type";

export async function performCommand(
  command: CommanderCommands
): Promise<void> {
  await activate(Applications.VOICE_OVER);

  const script = `tell application "VoiceOver"\ntell commander to perform command "${command.toLowerCase()}"\nend tell`;

  return await run<void, string>((appleScript) => {
    const app = Application.currentApplication();
    app.includeStandardAdditions = true;
    app.runScript(appleScript);
  }, script);
}
