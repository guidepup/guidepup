import { Applications } from "../Applications";
import type { CommanderCommands } from "./CommanderCommands";
import type { CommandOptions } from "../../CommandOptions";
import { ERR_VOICE_OVER_PERFORM_COMMAND } from "../errors";
import { retryIfAppleEventTimeout } from "../retryIfAppleEventTimeout";
import { runAppleScript } from "../runAppleScript";
import { withTransaction } from "../withTransaction";

export async function performCommand(
  command: CommanderCommands,
  options?: CommandOptions
): Promise<void> {
  const performCommandScript = `tell commander to perform command "${command}"`;

  const script = `tell application "${
    Applications.VoiceOver
  }"\n${withTransaction(performCommandScript)}\nend tell`;

  try {
    return await retryIfAppleEventTimeout(
      () => runAppleScript(script, options),
      options
    );
  } catch (e) {
    throw new Error(`${ERR_VOICE_OVER_PERFORM_COMMAND}\n${e.message}`);
  }
}
