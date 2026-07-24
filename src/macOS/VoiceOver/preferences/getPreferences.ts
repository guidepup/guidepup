import { DEFAULT_PREFERENCES } from "./constants";
import { ERR_VOICE_OVER_FAILED_TO_GET_SETTINGS } from "../../errors";
import { execFileSync } from "node:child_process";

let plist;

export function getPreferences(): Record<string, unknown> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plist ??= require("plist");

  try {
    const xml = execFileSync(
      "plutil",
      ["-convert", "xml1", "-o", "-", DEFAULT_PREFERENCES],
      {
        encoding: "utf8",
      },
    );

    return plist.parse(xml) as Record<string, unknown>;
  } catch (cause) {
    throw new Error(ERR_VOICE_OVER_FAILED_TO_GET_SETTINGS, { cause });
  }
}
