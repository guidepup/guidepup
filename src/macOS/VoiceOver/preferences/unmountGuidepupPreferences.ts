import { detachPortablePreferences } from "./detachPortablePreferences";
import { resolveCachePath } from "../../../resolveCachePath";
import { resolveDmgPath } from "./resolveDmgPath";

export function unmountGuidepupPreferences(): void {
  const cachePath = resolveCachePath();
  const dmgPath = resolveDmgPath(cachePath);

  detachPortablePreferences(dmgPath);
}
