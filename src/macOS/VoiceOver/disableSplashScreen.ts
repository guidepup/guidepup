import { ERR_VOICE_OVER_UNABLE_TO_DISABLE_SPLASH } from "../errors";
import { exec } from "child_process";

const DISABLE_VOICE_OVER_DIALOG =
  "defaults write com.apple.VoiceOverTraining doNotShowSplashScreen -bool true";

export async function disableSplashScreen(): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    exec(DISABLE_VOICE_OVER_DIALOG, (e) => {
      if (e) {
        reject(
          new Error(`${ERR_VOICE_OVER_UNABLE_TO_DISABLE_SPLASH}\n${e.message}`)
        );
      } else {
        resolve();
      }
    });
  });
}
