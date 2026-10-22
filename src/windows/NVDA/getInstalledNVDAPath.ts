import { DEFAULT_TIMEOUT } from "../../constants";
import { existsSync } from "node:fs";
import { spawnSync } from "child_process";
import { SUB_KEY_NVDA_APP_PATH } from "./constants";

// 32-bit NVDA releases write the key to the 32-bit registry view.
const REGISTRY_VIEWS = ["/reg:64", "/reg:32"];
const REG_SZ_VALUE = /REG_SZ\s+(.+?)\s*$/m;

/**
 * Get the path of the installed NVDA from the "App Paths" key that the NVDA
 * installer writes. This is not the portable NVDA that Guidepup runs.
 *
 * Returns `null` when NVDA is not installed or the path cannot be read.
 */
export function getInstalledNVDAPath(): string | null {
  for (const view of REGISTRY_VIEWS) {
    const { stdout } = spawnSync(
      "reg",
      ["query", SUB_KEY_NVDA_APP_PATH, "/ve", view],
      { encoding: "utf8", timeout: DEFAULT_TIMEOUT },
    );

    const executablePath = stdout?.match(REG_SZ_VALUE)?.[1];

    if (executablePath && existsSync(executablePath)) {
      return executablePath;
    }
  }

  return null;
}
