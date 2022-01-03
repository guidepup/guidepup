import { exec } from "child_process";
import { ERR_VOICE_OVER_CANNOT_BE_STARTED } from "../errors";

const VOICE_OVER_STARTER =
  "/System/Library/CoreServices/VoiceOver.app/Contents/MacOS/VoiceOverStarter";

export async function start(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    exec(VOICE_OVER_STARTER, (err) => {
      if (err) {
        reject(new Error(ERR_VOICE_OVER_CANNOT_BE_STARTED));
      } else {
        resolve();
      }
    });
  });
}
