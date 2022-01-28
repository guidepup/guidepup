import { access, constants } from "fs";

const VOICE_OVER_APPLESCRIPT_ENABLED_DB_FILE =
  "/private/var/db/Accessibility/.VoiceOverAppleScriptEnabled";

export async function enabledDbFile(): Promise<boolean> {
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
