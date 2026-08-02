import { attachPortablePreferences } from "./attachPortablePreferences";
import { DEFAULT_PREFERENCES } from "./constants";
import { detachPortablePreferences } from "./detachPortablePreferences";
import { ERR_VOICE_OVER_FAILED_TO_GET_SETTINGS } from "../../errors";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolveCachePath } from "../../../resolveCachePath";
import { resolveDmgPath } from "./resolveDmgPath";

let plist;

export function getPreferences(): Record<string, unknown> {
  let portablePreferencesAttached: boolean;
  let dmgPath: string;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plist ??= require("plist");

    portablePreferencesAttached = existsSync(DEFAULT_PREFERENCES);

    if (!portablePreferencesAttached) {
      const cachePath = resolveCachePath();
      dmgPath = resolveDmgPath(cachePath);

      attachPortablePreferences(dmgPath);
    }

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
  } finally {
    if (!portablePreferencesAttached) {
      try {
        detachPortablePreferences(dmgPath);
      } catch {
        // Swallow
      }
    }
  }
}
