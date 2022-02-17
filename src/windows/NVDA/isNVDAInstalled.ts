import { accessSync } from "fs";
import { DEFAULT_NVDA_PATH } from "./constants"

let installed: boolean;

export function isNVDAInstalled(): boolean {
  if (typeof installed === "undefined") {
    try {
      accessSync(DEFAULT_NVDA_PATH);
      installed = true;
    } catch (_) {
      installed = false;
    }
  }

  return installed;
}
