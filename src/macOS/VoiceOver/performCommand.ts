import { runAppleScript } from "../runAppleScript";
import { CommanderCommands } from "./CommanderCommands";
import { Applications } from "../Applications";

export async function performCommand(
  command: CommanderCommands
): Promise<void> {
  const script = `tell application "${
    Applications.VOICE_OVER
  }"\ntell commander to perform command "${command.toLowerCase()}"\nend tell`;

  return await runAppleScript(script);
}
