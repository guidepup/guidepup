import { ChildProcess, spawn } from "child_process";
import { ERR_NVDA_CANNOT_BE_STARTED, ERR_NVDA_NOT_INSTALLED } from "../errors";
import { getNVDAInstallationPath } from "./getNVDAInstallationPath";
import { resolveSessionUserConfigPath } from "./config";
import { waitForRunning } from "./waitForRunning";

const MAX_START_ATTEMPTS = 2;

export async function start(): Promise<void> {
  const executablePath = getNVDAInstallationPath();

  if (!executablePath) {
    throw new Error(ERR_NVDA_NOT_INSTALLED);
  }

  const sessionUserConfigPath = resolveSessionUserConfigPath();

  for (let attempt = 0; attempt < MAX_START_ATTEMPTS; attempt++) {
    let nvdaProcess: ChildProcess;
    let processError: Error | undefined;

    try {
      nvdaProcess = spawn(
        executablePath,
        ["--config-path", sessionUserConfigPath],
        {
          stdio: "ignore",
        },
      );
    } catch (e) {
      throw new Error(`${ERR_NVDA_CANNOT_BE_STARTED}\n${e.message}`, {
        cause: e,
      });
    }

    // Without a shell, a failed spawn (e.g. ENOENT) is emitted as an "error"
    // event rather than thrown. Unhandled, it would crash the host process.
    nvdaProcess.on("error", (e) => {
      processError = e;
    });

    try {
      await waitForRunning();

      break;
    } catch (e) {
      try {
        nvdaProcess.kill("SIGKILL");
      } catch {
        // swallow
      }

      if (attempt === MAX_START_ATTEMPTS - 1 && !processError) {
        throw e;
      }
    }

    if (attempt === MAX_START_ATTEMPTS - 1 && processError) {
      throw new Error(
        `${ERR_NVDA_CANNOT_BE_STARTED}\n${processError.message}`,
        {
          cause: processError,
        },
      );
    }
  }
}
