import type { CommandOptions } from "../../options";
import { exec } from "child_process";
import { Applications } from "../Applications";
import { activate } from "../activate";
import { runAppleScript } from "../runAppleScript";

export async function isRunning(options?: CommandOptions): Promise<boolean> {
  const processRunning = await new Promise<boolean>((resolve, reject) => {
    exec('ps aux | egrep "[V]oiceOver"', (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout !== "");
      }
    });
  });

  if (!processRunning) {
    return false;
  }

  const appleScriptRunning = await runAppleScript<string>(
    `tell application "${Applications.VOICE_OVER}"\nreturn running\nend tell`
  );

  if (appleScriptRunning === "false") {
    return false;
  }

  try {
    await activate(Applications.VOICE_OVER, options);

    return true;
  } catch (_) {
    return false;
  }
}
