import { attachPortablePreferences } from "./attachPortablePreferences";
import { base } from "../../../debug";
import { createPortableSymlinks } from "./createPortableSymlinks";
import { detachPortablePreferences } from "./detachPortablePreferences";
import { ensureLocalPreferencesExist } from "./ensureLocalPreferencesExist";
import { getPreferencesDirectory } from "./getPreferencesDirectory";
import { resolveCachePath } from "../../../resolveCachePath";
import { resolveDmgPath } from "./resolveDmgPath";
import { restartPreferencesDaemon } from "./restartPreferencesDaemon";
import { trustPortableIdentifier } from "./trustPortableIdentifier";

const debug = base.extend("mountGuidepupPreferences");

export function mountGuidepupPreferences(): void {
  debug("Mounting Guidepup VoiceOver preferences");

  const cachePath = resolveCachePath();
  debug("Resolved cache path:", cachePath);

  const preferencesDirectory = getPreferencesDirectory();
  debug("Resolved preferences directory:", preferencesDirectory);

  ensureLocalPreferencesExist(preferencesDirectory);
  debug("Ensured local preferences exist");

  const dmgPath = resolveDmgPath(cachePath);
  debug("Resolved preferences DMG:", dmgPath);

  debug("Detaching existing preferences DMG");
  detachPortablePreferences(dmgPath);
  debug("Detached existing preferences DMG");

  debug("Attaching preferences DMG");
  attachPortablePreferences(dmgPath);
  debug("Attached preferences DMG");

  debug("Trusting portable identifier");
  trustPortableIdentifier(preferencesDirectory);
  debug("Portable identifier trusted");

  debug("Restarting preferences daemon");
  restartPreferencesDaemon();
  debug("Preferences daemon restarted");

  debug("Creating portable preference symlinks");
  createPortableSymlinks(preferencesDirectory);
  debug("Portable preference symlinks created");

  debug("Restarting preferences daemon after symlink creation");
  restartPreferencesDaemon();
  debug("Preferences daemon restarted");
}
