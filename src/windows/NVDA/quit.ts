import { ERR_NVDA_NOT_INSTALLED, ERR_NVDA_QUIT } from "../errors";
import { getNVDAInstallationPath } from "./getNVDAInstallationPath";
import { spawnSync } from "child_process";

export function quit(): void {
  const executablePath = getNVDAInstallationPath();

  if (!executablePath) {
    throw new Error(ERR_NVDA_NOT_INSTALLED);
  }

  try {
    spawnSync(`"${executablePath}"`, ["--quit"], {
      shell: true,
      stdio: "ignore",
    });
  } catch (cause) {
    throw new Error(ERR_NVDA_QUIT, { cause });
  }
}
