import { execFileSync } from "node:child_process";
import { MOUNT_POINT } from "./constants";
import { rmSync } from "node:fs";

export function detachPortablePreferences(dmgPath): void {
  try {
    const device = execFileSync("/usr/bin/stat", ["-f", "%Sd", MOUNT_POINT], {
      encoding: "utf-8",
    }).trim();

    // Unmount with umount before detaching. hdiutil unmounts through
    // DiskArbitration, which waits up to 10s for every app that asked to
    // approve unmounts, and on macOS 26+ suspended widget extensions never
    // answer. umount also fails when the mount point isn't mounted, so the
    // device detached below is always the preferences image.
    execFileSync("/sbin/umount", [MOUNT_POINT], { stdio: "ignore" });
    execFileSync("/usr/bin/hdiutil", ["detach", device], { stdio: "ignore" });
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
