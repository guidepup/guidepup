import { buildIni } from "./buildIni";
import { ERR_NVDA_FAILED_TO_SET_SETTING } from "../../errors";
import { getConfig } from "./getConfig";
import { join } from "node:path";
import { resolveSessionUserConfigPath } from "./resolveSessionUserConfigPath";
import { writeFileSync } from "node:fs";

export function setConfig(desiredConfig: Record<string, unknown>): void {
  try {
    const config = getConfig();

    const updatedConfig = {
      ...config,
      desiredConfig,
    };

    const sessionUserConfigPath = resolveSessionUserConfigPath();
    const iniConfigFilePath = join(sessionUserConfigPath, "nvda.ini");

    writeFileSync(iniConfigFilePath, buildIni(updatedConfig));
  } catch (cause) {
    throw new Error(ERR_NVDA_FAILED_TO_SET_SETTING, { cause });
  }
}
