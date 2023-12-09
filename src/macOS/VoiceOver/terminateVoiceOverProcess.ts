import { exec } from "child_process";

export async function terminateVoiceOverProcess(): Promise<void> {
  return new Promise<void>((resolve) => {
    exec(
      `kill -15 $(ps aux | egrep "[V]oiceOver.app/Contents/MacOS/VoiceOver launchd -s" | awk '{print $2}')`,
      () => {
        resolve();
      }
    );
  });
}
