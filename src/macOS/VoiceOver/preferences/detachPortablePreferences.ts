import { execFileSync } from "node:child_process";
import { MOUNT_POINT } from "./constants";

export function detachPortablePreferences(): void {
  try {
    execFileSync("/usr/bin/hdiutil", ["detach", MOUNT_POINT]);
  } catch {
    // Swallow as already detached
  }
}
