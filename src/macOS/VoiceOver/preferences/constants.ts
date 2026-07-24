import { join } from "node:path";

export const VOLUME_NAME = "GuidepupVoiceOverPreferences";
export const MOUNT_POINT = join("/Volumes", VOLUME_NAME);
export const PREFERENCES_PATH = join(
  MOUNT_POINT,
  "VoiceOver",
  "VoiceOver4.portable",
);
export const DEFAULT_PREFERENCES = join(PREFERENCES_PATH, "default.plist");

export const GUIDEPUP_IDENTIFIER =
  "4800BFDE-77D8-4A27-A8E2-90CD8CE508EA-guidepup";

export const VOICEOVER_DOMAIN = "com.apple.VoiceOver4/default";
