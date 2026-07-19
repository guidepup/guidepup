import { rmSync, symlinkSync } from "node:fs";
import { ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES } from "../../errors";
import { join } from "node:path";
import { MOUNT_POINT } from "./constants";

const SYMLINK_FILES = [
  "com.apple.VoiceOver4.portable.scrd",
  "com.apple.VoiceOver4.portable.scrd.vou",
  "com.apple.VoiceOver4.portable.scro",
  "com.apple.VoiceOver4.portable.scui",
];

export function createPortableSymlinks(preferencesDirectory: string): void {
  const target = `${MOUNT_POINT}/VoiceOver/VoiceOver4.portable`;

  for (const file of SYMLINK_FILES) {
    const linkPath = join(preferencesDirectory, file);

    try {
      rmSync(linkPath, { force: true });
    } catch {
      // Swallow
    }

    try {
      symlinkSync(target, linkPath);
    } catch (cause) {
      throw new Error(ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES, {
        cause,
      });
    }
  }
}
