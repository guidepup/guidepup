import { exec } from "child_process";

export async function start(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    exec(
      "/System/Library/CoreServices/VoiceOver.app/Contents/MacOS/VoiceOverStarter",
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}
