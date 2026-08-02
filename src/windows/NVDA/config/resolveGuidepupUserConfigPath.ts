import { join } from "node:path";
import { resolveCachePath } from "../../../resolveCachePath";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const manifest = require("../../../../manifest.json");

export function resolveGuidepupUserConfigPath() {
  const asset = manifest.screenReaders.find(({ id }) => id === "nvda")
    .assets[0];

  const cachePath = resolveCachePath();

  return join(
    cachePath,
    "nvda",
    "all",
    asset.version,
    "extracted",
    "userConfig",
  );
}
