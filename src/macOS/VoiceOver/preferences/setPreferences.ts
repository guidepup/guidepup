import { DEFAULT_PREFERENCES } from "./constants";
import { ERR_VOICE_OVER_FAILED_TO_SET_SETTING } from "../../errors";
import { getPreferences } from "./getPreferences";
import { restartPreferencesDaemon } from "./restartPreferencesDaemon";
import { writeFileSync } from "node:fs";

let plist;

export function setPreferences(
  desiredPreferences: Record<string, unknown>,
): void {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plist ??= require("plist");

  try {
    const preferences = getPreferences();

    const updatedPreferences = {
      ...preferences,
      ...desiredPreferences,
    };

    writeFileSync(DEFAULT_PREFERENCES, plist.build(updatedPreferences));
  } catch (cause) {
    throw new Error(ERR_VOICE_OVER_FAILED_TO_SET_SETTING, { cause });
  }

  restartPreferencesDaemon();
}
