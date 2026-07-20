import { ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES } from "../../errors";
import { execFileSync } from "node:child_process";
import { GUIDEPUP_IDENTIFIER } from "./constants";
import { join } from "node:path";

export function trustPortableIdentifier(preferencesDirectory: string): void {
  const localPlist = join(
    preferencesDirectory,
    "com.apple.VoiceOver4.local.plist",
  );

  let stdout: string;

  try {
    stdout = execFileSync(
      "/usr/libexec/PlistBuddy",
      ["-c", "Print :SCRCUserDefaultsAlwaysUsePortableIDs", localPlist],
      {
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
  } catch (cause) {
    if (!cause.stderr.includes("Does Not Exist")) {
      throw new Error(ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES, {
        cause,
      });
    }

    try {
      execFileSync(
        "/usr/libexec/PlistBuddy",
        ["-c", "Add :SCRCUserDefaultsAlwaysUsePortableIDs array", localPlist],
        { stdio: "ignore" },
      );
    } catch (cause) {
      throw new Error(ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES, {
        cause,
      });
    }

    stdout = "Array {\n}\n";
  }

  if (stdout.includes(GUIDEPUP_IDENTIFIER)) {
    return;
  }

  const index = stdout
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && line !== "Array {" && line !== "}").length;

  try {
    execFileSync(
      "/usr/libexec/PlistBuddy",
      [
        "-c",
        `Add :SCRCUserDefaultsAlwaysUsePortableIDs:${index} string ${GUIDEPUP_IDENTIFIER}`,
        localPlist,
      ],
      { stdio: "ignore" },
    );
  } catch (cause) {
    throw new Error(ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES, {
      cause,
    });
  }
}
