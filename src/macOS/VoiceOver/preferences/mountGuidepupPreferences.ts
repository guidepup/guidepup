import { attachPortablePreferences } from "./attachPortablePreferences";
import { createPortableSymlinks } from "./createPortableSymlinks";
import { detachPortablePreferences } from "./detachPortablePreferences";
import { ensureLocalPreferencesExist } from "./ensureLocalPreferencesExist";
import { getPreferencesDirectory } from "./getPreferencesDirectory";
import { resolveCachePath } from "../../../resolveCachePath";
import { resolveDmgPath } from "./resolveDmgPath";
import { restartPreferencesDaemon } from "./restartPreferencesDaemon";
import { trustPortableIdentifier } from "./trustPortableIdentifier";

export function mountGuidepupPreferences(): void {
  const cachePath = resolveCachePath();

  const preferencesDirectory = getPreferencesDirectory();
  ensureLocalPreferencesExist(preferencesDirectory);

  detachPortablePreferences();
  const dmgPath = resolveDmgPath(cachePath);
  attachPortablePreferences(dmgPath);

  trustPortableIdentifier(preferencesDirectory);
  restartPreferencesDaemon();
  createPortableSymlinks(preferencesDirectory);
  restartPreferencesDaemon();
}
