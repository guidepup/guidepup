import { ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES } from "../../errors";
import { execFileSync } from "node:child_process";
import { MOUNT_POINT } from "./constants";

export function attachPortablePreferences(dmgPath: string): void {
  try {
    execFileSync("/usr/bin/hdiutil", [
      "attach",
      dmgPath,
      "-mountpoint",
      MOUNT_POINT,
      "-shadow",
    ]);
  } catch (cause) {
    throw new Error(ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES, {
      cause,
    });
  }
}
