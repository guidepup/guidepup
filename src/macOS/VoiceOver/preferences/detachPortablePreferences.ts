import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";

interface AttachedImage {
  "image-path": string;
  "system-entities": { "dev-entry": string; "mount-point"?: string }[];
}

let plist;

export function detachPortablePreferences(dmgPath): void {
  let images: AttachedImage[] = [];

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plist ??= require("plist");

    const xml = execFileSync("/usr/bin/hdiutil", ["info", "-plist"], {
      encoding: "utf-8",
    });

    images = plist.parse(xml).images;
  } catch {
    // Swallow as nothing attached
  }

  // Find the image by its path rather than the mount point, so an image left
  // attached but unmounted by an earlier failed detach is cleaned up too.
  for (const image of images) {
    if (image["image-path"] !== dmgPath) {
      continue;
    }

    const entities = image["system-entities"];

    try {
      // Unmount with umount before detaching. hdiutil unmounts through
      // DiskArbitration, which waits up to 10s for every app that asked to
      // approve unmounts, and on macOS 26+ suspended widget extensions never
      // answer.
      for (const { "mount-point": mountPoint } of entities) {
        if (mountPoint) {
          execFileSync("/sbin/umount", [mountPoint], { stdio: "ignore" });
        }
      }

      execFileSync("/usr/bin/hdiutil", ["detach", entities[0]["dev-entry"]], {
        stdio: "ignore",
      });
    } catch {
      // Swallow as already detached
    }
  }

  const dmgShadowPath = `${dmgPath}.shadow`;

  try {
    rmSync(dmgShadowPath, { force: true });
  } catch {
    // Swallow
  }
}
