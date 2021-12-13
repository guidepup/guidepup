import { run } from "@jxa/run";
import { CommanderCommand } from "./CommanderCommand";
import { Applications } from "../Applications";
import { activate } from "../activate";
import "@jxa/global-type";

export async function performCommand(text: CommanderCommand): Promise<void> {
  await activate(Applications.VOICE_OVER);

  const script = `tell application "VoiceOver"\ntell command to perform command ${text.toLowerCase()}\nend tell`;

  return await run<void, string>((appleScript) => {
    const app = Application.currentApplication();
    app.includeStandardAdditions = true;
    app.runScript(appleScript);
  }, script);
}
