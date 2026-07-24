import { DEFAULT_PREFERENCES } from "./constants";
import { ERR_VOICE_OVER_FAILED_TO_SET_SETTING } from "../../errors";
import { getPreferences } from "./getPreferences";
import { restartPreferencesDaemon } from "./restartPreferencesDaemon";
import { writeFileSync } from "node:fs";

let plist;

export function setPreference(key: string, value: unknown): void {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plist ??= require("plist");

  try {
    const preferences = getPreferences();

    preferences[key] = value;

    writeFileSync(DEFAULT_PREFERENCES, plist.build(preferences));
  } catch (cause) {
    throw new Error(ERR_VOICE_OVER_FAILED_TO_SET_SETTING, { cause });
  }

  restartPreferencesDaemon();
}
