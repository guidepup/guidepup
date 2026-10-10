import {
  ERR_LINUX_VERSION_NOT_SUPPORTED,
  ERR_ORCA_FAILED_TO_LOAD_GUIDEPUP_SETTINGS,
} from "../errors";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { release } from "node:os";
import { resolveCachePath } from "../../resolveCachePath";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const manifest = require("../../../manifest.json");

let installationPath: string;

export function getOrcaInstallationPath(): string {
  if (installationPath) {
    return installationPath;
  }

  const osVersion = release().split(".", 1)[0];

  const asset = manifest.screenReaders
    .find(({ id }) => id === "orca")
    .assets.find(({ platformVersion }) => platformVersion === osVersion);

  if (!asset) {
    throw new Error(ERR_LINUX_VERSION_NOT_SUPPORTED);
  }

  const cachePath = resolveCachePath();

  const assetPath = join(
    cachePath,
    "orca",
    asset.platformVersion,
    asset.version,
    "extracted",
  );

  if (!existsSync(assetPath)) {
    throw new Error(ERR_ORCA_FAILED_TO_LOAD_GUIDEPUP_SETTINGS);
  }

  installationPath = assetPath;

  return installationPath;
}
