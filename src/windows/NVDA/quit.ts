import { ERR_NVDA_NOT_INSTALLED, ERR_NVDA_QUIT } from "../errors";
import { getNVDAInstallationPath } from "./getNVDAInstallationPath";
import { spawnSync } from "child_process";

export async function quit(): Promise<void> {
  const executablePath = await getNVDAInstallationPath();

  if (!executablePath) {
    throw new Error(ERR_NVDA_NOT_INSTALLED);
  }

  try {
    spawnSync(`"${executablePath}"`, ["--quit"], {
      shell: true,
      stdio: "ignore",
    });
  } catch (e) {
    throw new Error(`${ERR_NVDA_QUIT}\n${e.message}`);
  }
}
