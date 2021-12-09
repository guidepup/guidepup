import { exec } from "child_process";

const DISABLE_VOICE_OVER_DIALOG =
  "defaults write com.apple.VoiceOverTraining doNotShowSplashScreen -bool true";

export async function disableSplashScreen(): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    exec(DISABLE_VOICE_OVER_DIALOG, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
