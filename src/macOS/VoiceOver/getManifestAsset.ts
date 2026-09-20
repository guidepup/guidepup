import { ERR_MACOS_VERSION_NOT_SUPPORTED } from "../errors";
import { release } from "node:os";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const manifest = require("../../../manifest.json");

export function getManifestAsset() {
  const osVersion = release().split(".", 1)[0];

  const asset = manifest.screenReaders
    .find(({ id }) => id === "voiceover")
    .assets.find(({ platformVersion }) => platformVersion === osVersion);

  if (!asset) {
    throw new Error(`${ERR_MACOS_VERSION_NOT_SUPPORTED}: ${osVersion}`);
  }

  return asset;
}
