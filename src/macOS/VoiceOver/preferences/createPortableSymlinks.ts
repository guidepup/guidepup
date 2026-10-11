import {
  ERR_PREFIX_VOICE_OVER_PORTABLE_PREFERENCES_NOT_REPLACED,
  ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES,
} from "../../errors";
import {
  lstatSync,
  readlinkSync,
  rmSync,
  type Stats,
  symlinkSync,
} from "node:fs";
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

    let existing: Stats | undefined;

    try {
      existing = lstatSync(linkPath);
    } catch {
      // Doesn't exist — create it below.
    }

    if (
      existing?.isSymbolicLink() &&
      readlinkSync(linkPath) === PREFERENCES_PATH
    ) {
      continue;
    }

    // Guidepup only ever puts symlinks here. Anything else may be the
    // user's own VoiceOver preferences, so never remove it.
    if (existing && !existing.isSymbolicLink()) {
      throw new Error(ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES, {
        cause: new Error(
          `${ERR_PREFIX_VOICE_OVER_PORTABLE_PREFERENCES_NOT_REPLACED}${linkPath}`,
        ),
      });
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
