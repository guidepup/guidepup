import { existsSync } from "node:fs";
import { PREFERENCES_PATH } from "./constants";

export function isGuidepupPreferencesMounted(): boolean {
  return existsSync(PREFERENCES_PATH);
}
