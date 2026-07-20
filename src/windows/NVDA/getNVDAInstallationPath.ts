import { existsSync } from "node:fs";
import { join } from "node:path";
import { resolveCachePath } from "../../resolveCachePath";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const manifest = require("../../../manifest.json");

let installationPath: string;

export function getNVDAInstallationPath(): string | null {
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
    return null;
  }

  installationPath = assetPath;

  return installationPath;
}
