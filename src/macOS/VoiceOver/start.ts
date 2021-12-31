import { exec } from "child_process";

const VOICE_OVER_STARTER =
  "/System/Library/CoreServices/VoiceOver.app/Contents/MacOS/VoiceOverStarter";

export async function start(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    exec(VOICE_OVER_STARTER, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
