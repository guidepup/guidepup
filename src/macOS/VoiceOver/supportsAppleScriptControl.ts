import { exec } from "child_process";
import { access, constants } from "fs";

const VOICE_OVER_APPLESCRIPT_ENABLED_DEFAULTS =
  "defaults read com.apple.VoiceOver4/default SCREnableAppleScript";

async function enabledDefaults(): Promise<boolean> {
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

const VOICE_OVER_APPLESCRIPT_ENABLED_DB_FILE =
  "/private/var/db/Accessibility/.VoiceOverAppleScriptEnabled";

async function enabledDbFile(): Promise<boolean> {
  return await new Promise<boolean>((resolve) => {
    access(VOICE_OVER_APPLESCRIPT_ENABLED_DB_FILE, constants.F_OK, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

export async function supportsAppleScriptControl(): Promise<boolean> {
  const results = await Promise.all([enabledDefaults(), enabledDbFile()]);

  return results.every((value) => value);
}
