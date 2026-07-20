import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export function getPreferencesDirectory(): string {
  const voiceOverPreferencesDirectory = join(
    homedir(),
    "Library",
    "Group Containers",
    "group.com.apple.VoiceOver",
    "Library",
    "Preferences",
  );

  if (existsSync(voiceOverPreferencesDirectory)) {
    return voiceOverPreferencesDirectory;
  }

  return join(homedir(), "Library", "Preferences");
}
