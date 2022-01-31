import { accessSync } from "fs";
import { join } from "path";

const DEFAULT_NVDA_PATH = join(
  "C:/",
  "Program Files (x86)",
  "NVDA",
  "nvda.exe"
);

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
