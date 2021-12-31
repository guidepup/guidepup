import { exec } from "child_process";
import { ERR_VOICE_OVER_UNABLE_TO_DISABLE_SPLASH } from "./errors";

const DISABLE_VOICE_OVER_DIALOG =
  "defaults write com.apple.VoiceOverTraining doNotShowSplashScreen -bool true";

export async function disableSplashScreen(): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    exec(DISABLE_VOICE_OVER_DIALOG, (err) => {
      if (err) {
        reject(new Error(ERR_VOICE_OVER_UNABLE_TO_DISABLE_SPLASH));
      } else {
        resolve();
      }
    });
  });
}
