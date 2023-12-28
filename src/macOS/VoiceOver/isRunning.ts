import { activate } from "../activate";
import { Applications } from "../Applications";
import type { CommandOptions } from "../../CommandOptions";
import { exec } from "child_process";
import { runAppleScript } from "../runAppleScript";

export async function isRunning(
  options?: CommandOptions,
  skipActivate = false
): Promise<boolean> {
  const processRunning = await new Promise<boolean>((resolve) => {
    exec('ps aux | egrep "[V]oiceOver"', (err, stdout) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stdout !== "");
      }
    });
  });

  if (!processRunning) {
    return false;
  }

  const appleScriptRunning = await runAppleScript<string>(
    `tell application "${Applications.VoiceOver}"\nreturn running\nend tell`
  );

  if (appleScriptRunning === "false") {
    return false;
  }

  if (skipActivate) {
    return true;
  }

  try {
    await activate(Applications.VoiceOver, options);

    return true;
  } catch {
    return false;
  }
}
