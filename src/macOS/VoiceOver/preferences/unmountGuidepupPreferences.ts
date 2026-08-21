import { base } from "../../../debug";
import { detachPortablePreferences } from "./detachPortablePreferences";
import { resolveCachePath } from "../../../resolveCachePath";
import { resolveDmgPath } from "./resolveDmgPath";

const debug = base.extend("unmountGuidepupPreferences");

export function unmountGuidepupPreferences(): void {
  debug("Unmounting Guidepup VoiceOver preferences");

  const cachePath = resolveCachePath();
  debug("Resolved cache path:", cachePath);

  const dmgPath = resolveDmgPath(cachePath);
  debug("Resolved preferences DMG:", dmgPath);

  debug("Detaching existing preferences DMG");
  detachPortablePreferences(dmgPath);
  debug("Detached existing preferences DMG");
}
