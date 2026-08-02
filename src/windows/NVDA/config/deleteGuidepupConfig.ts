import { resolveSessionUserConfigPath } from "./resolveSessionUserConfigPath";
import { rmSync } from "node:fs";

export const deleteGuidepupConfig = () => {
  const sessionUserConfigPath = resolveSessionUserConfigPath();

  try {
    rmSync(sessionUserConfigPath, {
      recursive: true,
      force: true,
    });
  } catch {
    // Swallow
  }
};
