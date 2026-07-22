import { Applications } from "../Applications";
import type { CommandOptions } from "../../CommandOptions";
import { execFileSync } from "child_process";
import { runAppleScript } from "../runAppleScript";

export async function isRunning(
  options?: CommandOptions,
  skipAppleScript = false,
): Promise<boolean> {
  let processRunning: boolean;

  try {
    processRunning =
      execFileSync("pgrep", ["-f", "VoiceOver launchd -s"], {
        encoding: "utf8",
        timeout: 2000,
      }).length > 0;
  } catch {
    return false;
  }

  if (!processRunning) {
    return false;
  }

  if (skipAppleScript) {
    return true;
  }

  const appleScriptRunning = await runAppleScript<string>(
    `tell application "${Applications.VoiceOver}"\nreturn running\nend tell`,
    options,
  );

  return appleScriptRunning !== "false";
}
