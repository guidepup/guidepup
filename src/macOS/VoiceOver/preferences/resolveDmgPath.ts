import {
  ERR_MACOS_VERSION_NOT_SUPPORTED,
  ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES,
} from "../../errors";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { release } from "node:os";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const manifest = require("../../../../manifest.json");

let installationPath: string;

export function resolveDmgPath(cachePath: string) {
  const osVersion = release().split(".", 1)[0];

  const asset = manifest.screenReaders
    .find(({ id }) => id === "voiceover")
    .assets.find(({ platformVersion }) => platformVersion === osVersion);

  if (!asset) {
    throw new Error(ERR_MACOS_VERSION_NOT_SUPPORTED);
  }

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
