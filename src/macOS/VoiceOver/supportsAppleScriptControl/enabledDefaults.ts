import { exec } from "child_process";

const VOICE_OVER_APPLESCRIPT_ENABLED_DEFAULTS =
  "defaults read com.apple.VoiceOver4/default SCREnableAppleScript";

export async function enabledDefaults(): Promise<boolean> {
  return await new Promise<boolean>((resolve) => {
    exec(VOICE_OVER_APPLESCRIPT_ENABLED_DEFAULTS, (err, stdout) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stdout.trim() === "1");
      }
    });
  });
}
