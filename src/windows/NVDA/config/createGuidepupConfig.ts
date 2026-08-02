import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import {
  ERR_NVDA_FAILED_TO_CREATE_GUIDEPUP_PREFERENCES,
  ERR_NVDA_NOT_INSTALLED,
} from "../../errors";
import { join } from "node:path";
import { resolveGuidepupUserConfigPath } from "./resolveGuidepupUserConfigPath";
import { resolveSessionUserConfigPath } from "./resolveSessionUserConfigPath";

export const createGuidepupConfig = () => {
  const guidepupUserConfigPath = resolveGuidepupUserConfigPath();

  if (!existsSync(guidepupUserConfigPath)) {
    throw new Error(ERR_NVDA_NOT_INSTALLED);
  }

  const sessionUserConfigPath = resolveSessionUserConfigPath();

  try {
    rmSync(sessionUserConfigPath, {
      recursive: true,
      force: true,
    });
  } catch {
    // Swallow
  }

  try {
    mkdirSync(sessionUserConfigPath, {
      recursive: true,
    });

    const entries = readdirSync(guidepupUserConfigPath, {
      encoding: "utf-8",
    });

    for (const entry of entries) {
      cpSync(
        join(guidepupUserConfigPath, entry),
        join(sessionUserConfigPath, entry),
        {
          recursive: true,
        },
      );
    }
  } catch (error) {
    try {
      rmSync(sessionUserConfigPath, {
        recursive: true,
        force: true,
      });
    } catch {
      // Swallow
    }

    throw new Error(ERR_NVDA_FAILED_TO_CREATE_GUIDEPUP_PREFERENCES, {
      cause: error,
    });
  }
};
