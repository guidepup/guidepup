import { ChildProcess, spawn } from "child_process";
import { ERR_NVDA_CANNOT_BE_STARTED, ERR_NVDA_NOT_INSTALLED } from "../errors";
import { getNVDAInstallationPath } from "./getNVDAInstallationPath";
import { waitForRunning } from "./waitForRunning";

const MAX_START_ATTEMPTS = 2;

export async function start(): Promise<void> {
  const executablePath = await getNVDAInstallationPath();

  if (!executablePath) {
    throw new Error(ERR_NVDA_NOT_INSTALLED);
  }

  for (let attempt = 0; attempt < MAX_START_ATTEMPTS; attempt++) {
    let nvdaProcess: ChildProcess;

    try {
      nvdaProcess = spawn(`"${executablePath}"`, ["--minimal"], {
        shell: true,
        stdio: "ignore",
      });
    } catch (e) {
      throw new Error(`${ERR_NVDA_CANNOT_BE_STARTED}\n${e.message}`);
    }

    try {
      await waitForRunning();

      break;
    } catch (e) {
      nvdaProcess.kill("SIGKILL");

      if (attempt === MAX_START_ATTEMPTS - 1) {
        throw e;
      }
    }
  }
}
