import { ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES } from "../../errors";
import { existsSync } from "node:fs";
import { join } from "node:path";

export function ensureLocalPreferencesExist(
  preferencesDirectory: string,
): void {
  const localPlist = join(
    preferencesDirectory,
    "com.apple.VoiceOver4.local.plist",
  );

  if (!existsSync(localPlist)) {
    throw new Error(ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES);
  }
}
