import { buildIni } from "./buildIni";
import { deepMerge } from "../../../deepMerge";
import { ERR_NVDA_FAILED_TO_SET_SETTING } from "../../errors";
import { getConfig } from "./getConfig";
import { join } from "node:path";
import { resolveSessionUserConfigPath } from "./resolveSessionUserConfigPath";
import { writeFileSync } from "node:fs";

export function setConfig(desiredConfig: Record<string, unknown>): void {
  try {
    const config = getConfig();

    const updatedConfig = deepMerge(config, desiredConfig);

    const sessionUserConfigPath = resolveSessionUserConfigPath();
    const iniConfigFilePath = join(sessionUserConfigPath, "nvda.ini");

    const builtConfig = buildIni(updatedConfig);

    writeFileSync(iniConfigFilePath, builtConfig);
  } catch (cause) {
    throw new Error(ERR_NVDA_FAILED_TO_SET_SETTING, { cause });
  }
}
