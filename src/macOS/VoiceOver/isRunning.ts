import { exec } from "child_process";
import { run } from "@jxa/run";
import { Applications } from "../Applications";
import "@jxa/global-type";

export async function isRunning(): Promise<boolean> {
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

  const appleScriptRunning = await run<boolean, Applications.VOICE_OVER>(
    (name) => {
      const app = Application(name);
      app.includeStandardAdditions = true;

      return app.running();
    },
    Applications.VOICE_OVER
  );

  if (!appleScriptRunning) {
    return false;
  }

  try {
    await run<boolean, Applications.VOICE_OVER>((name) => {
      const app = Application(name);
      app.includeStandardAdditions = true;
      app.activate();
    }, Applications.VOICE_OVER);

    return true;
  } catch {
    return false;
  }
}
