import { ERR_VOICE_OVER_FAILED_TO_GET_SETTINGS } from "../../errors";
import { execFileSync } from "node:child_process";
import { parse } from "plist";
import { VOICEOVER_DOMAIN } from "./constants";

export function getPreferences(): Record<string, unknown> {
  try {
    const xml = execFileSync("defaults", ["export", VOICEOVER_DOMAIN, "-"], {
      encoding: "utf8",
    });

    return parse(xml) as Record<string, unknown>;
  } catch (cause) {
    throw new Error(ERR_VOICE_OVER_FAILED_TO_GET_SETTINGS, { cause });
  }
}
