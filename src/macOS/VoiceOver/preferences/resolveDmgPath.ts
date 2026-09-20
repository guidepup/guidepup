import { ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES } from "../../errors";
import { existsSync } from "node:fs";
import { getManifestAsset } from "../getManifestAsset";
import { join } from "node:path";

let installationPath: string;

export function resolveDmgPath(cachePath: string) {
  const asset = getManifestAsset();

  const assetPath = join(
    cachePath,
    "voiceover",
    asset.platformVersion,
    asset.version,
    asset.asset,
  );

  if (!existsSync(assetPath)) {
    throw new Error(ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES);
  }

  installationPath = assetPath;

  return installationPath;
}
