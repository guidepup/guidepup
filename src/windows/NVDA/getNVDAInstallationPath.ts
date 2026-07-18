import { ERR_NVDA_NOT_INSTALLED } from "../errors";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { resolveCachePath } from "../../resolveCachePath";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const manifest = require("../../../manifest.json");

let installationPath: string;

export async function getNVDAInstallationPath(): Promise<string> {
  if (installationPath) {
    return installationPath;
  }

  const asset = manifest.screenReaders.find(({ id }) => id === "nvda")
    .assets[0];

  const cachePath = resolveCachePath();

  const assetPath = join(
    cachePath,
    "nvda",
    "all",
    asset.version,
    "extracted",
    "nvda.exe",
  );

  if (!existsSync(assetPath)) {
    throw new Error(ERR_NVDA_NOT_INSTALLED);
  }

  return (installationPath = assetPath);
}
