import { ERR_NVDA_CANNOT_BE_STARTED, ERR_NVDA_NOT_INSTALLED } from "../errors";
import { getNVDAInstallationPath } from "./getNVDAInstallationPath";
import { spawn } from "child_process";
import { waitForRunning } from "./waitForRunning";

export async function start(): Promise<void> {
  const executablePath = await getNVDAInstallationPath();

  if (!executablePath) {
    throw new Error(ERR_NVDA_NOT_INSTALLED);
  }

  try {
    spawn(`"${executablePath}"`, ["--minimal"], {
      shell: true,
      stdio: "ignore",
    });
  } catch (e) {
    throw new Error(`${ERR_NVDA_CANNOT_BE_STARTED}\n${e.message}`);
  }

  await waitForRunning();
}
