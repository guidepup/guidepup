import { ERR_NVDA_CANNOT_BE_STARTED, ERR_NVDA_NOT_INSTALLED } from "../errors";
import { getNVDAInstallationPath } from "./getNVDAInstallationPath";
import { resolveSessionUserConfigPath } from "./config";
import { spawn } from "child_process";
import { waitForRunning } from "./waitForRunning";

const MAX_START_ATTEMPTS = 2;

export async function start(): Promise<void> {
  const executablePath = getNVDAInstallationPath();

  if (!executablePath) {
    throw new Error(ERR_NVDA_NOT_INSTALLED);
  }

  const sessionUserConfigPath = resolveSessionUserConfigPath();

  for (let attempt = 0; attempt < MAX_START_ATTEMPTS; attempt++) {
    const nvdaProcess = spawn(
      executablePath,
      ["--config-path", sessionUserConfigPath],
      {
        shell: true,
        stdio: "ignore",
      },
    );

    try {
      await waitForRunning();
      return;
    } catch (e) {
      try {
        nvdaProcess.kill("SIGKILL");
      } catch {
        // swallow
      }

      if (attempt === MAX_START_ATTEMPTS - 1) {
        throw new Error(`${ERR_NVDA_CANNOT_BE_STARTED}\n${e.message}`, {
          cause: e,
        });
      }
    }
  }
}
