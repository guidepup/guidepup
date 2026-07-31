import { existsSync, readFileSync } from "node:fs";
import { ERR_NVDA_FAILED_TO_GET_SETTINGS } from "../../errors";
import { join } from "node:path";
import { parseIni } from "./parseIni";
import { resolveGuidepupUserConfigPath } from "./resolveGuidepupUserConfigPath";
import { resolveSessionUserConfigPath } from "./resolveSessionUserConfigPath";

export function getConfig(): Record<string, unknown> {
  const sessionUserConfigPath = join(
    resolveSessionUserConfigPath(),
    "nvda.ini",
  );

  const configPath = existsSync(sessionUserConfigPath)
    ? sessionUserConfigPath
    : join(resolveGuidepupUserConfigPath(), "nvda.ini");

  try {
    const contents = readFileSync(configPath, "utf8");

    return parseIni(contents);
  } catch (cause) {
    throw new Error(ERR_NVDA_FAILED_TO_GET_SETTINGS, {
      cause,
    });
  }
}
