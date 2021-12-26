import { join } from "path";
import { accessSync } from "fs";

const DEFAULT_NVDA_PATH = join(
  "C:/",
  "Program Files (x86)",
  "NVDA",
  "nvda.exe"
);

let installed: boolean;

try {
  accessSync(DEFAULT_NVDA_PATH);
  installed = true;
} catch {
  installed = false;
}

export function isNVDAInstalled(): boolean {
  return installed;
}
