import { getPreferences } from "./getPreferences";

export function getPreference(key: string): unknown {
  const preferences = getPreferences();

  return preferences[key];
}
