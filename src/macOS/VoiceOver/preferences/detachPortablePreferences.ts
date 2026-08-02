import { execFileSync } from "node:child_process";
import { MOUNT_POINT } from "./constants";
import { rmSync } from "node:fs";

export function detachPortablePreferences(dmgPath): void {
  try {
    execFileSync("/usr/bin/hdiutil", ["detach", MOUNT_POINT], {
      stdio: "ignore",
    });
  } catch {
    // Swallow as already detached
  }

  const dmgShadowPath = `${dmgPath}.shadow`;

  try {
    rmSync(dmgShadowPath, { force: true });
  } catch {
    // Swallow
  }
}
