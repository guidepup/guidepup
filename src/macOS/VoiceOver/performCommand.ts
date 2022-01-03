import { runAppleScript } from "../runAppleScript";
import { CommanderCommands } from "./CommanderCommands";
import { Applications } from "../Applications";
import { ERR_VOICE_OVER_PERFORM_COMMAND } from "../errors";

export async function performCommand(
  command: CommanderCommands
): Promise<void> {
  const script = `tell application "${
    Applications.VOICE_OVER
  }"\ntell commander to perform command "${command.toLowerCase()}"\nend tell`;

  try {
    return await runAppleScript(script);
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_PERFORM_COMMAND}\n${e.message}`);
  }
}
