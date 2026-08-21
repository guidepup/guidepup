import { lstatSync, readlinkSync, rmSync, symlinkSync } from "node:fs";
import { ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES } from "../../errors";
import { join } from "node:path";
import { PREFERENCES_PATH } from "./constants";

const SYMLINK_FILES = [
  "com.apple.VoiceOver4.portable.scrd",
  "com.apple.VoiceOver4.portable.scrd.vou",
  "com.apple.VoiceOver4.portable.scro",
  "com.apple.VoiceOver4.portable.scui",
];

export function createPortableSymlinks(preferencesDirectory: string): void {
  for (const file of SYMLINK_FILES) {
    const linkPath = join(preferencesDirectory, file);

    try {
      if (
        lstatSync(linkPath).isSymbolicLink() &&
        readlinkSync(linkPath) === PREFERENCES_PATH
      ) {
        continue;
      }
    } catch {
      // Doesn't exist — create it below.
    }

    try {
      rmSync(linkPath, { force: true });
      symlinkSync(PREFERENCES_PATH, linkPath);
    } catch (cause) {
      throw new Error(ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES, {
        cause,
      });
    }
  }
}
