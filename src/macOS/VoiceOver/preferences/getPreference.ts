import { getPreferences } from "./getPreferences";

export function getPreference(key: string): unknown {
  return getPreferences()[key];
}
