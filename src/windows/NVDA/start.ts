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

  console.log({
    executablePath,
    sessionUserConfigPath,
  });

  for (let attempt = 0; attempt < MAX_START_ATTEMPTS; attempt++) {
    let nvdaProcess: ChildProcess;

    try {
      nvdaProcess = spawn(
        executablePath,
        ["--config-path", sessionUserConfigPath, "--log-level", "DEBUG"],
        {
          shell: true,
          stdio: ["ignore", "pipe", "pipe"],
        },
      );

      nvdaProcess.stdout?.on("data", (data) => {
        console.log("NVDA stdout:", data.toString());
      });

      nvdaProcess.stderr?.on("data", (data) => {
        console.error("NVDA stderr:", data.toString());
      });

      nvdaProcess.on("exit", (code, signal) => {
        console.log("NVDA exited", { code, signal });
      });
    } catch (e) {
      throw new Error(`${ERR_NVDA_CANNOT_BE_STARTED}\n${e.message}`, {
        cause: e,
      });
    }

    try {
      await waitForRunning();

      break;
    } catch (e) {
      try {
        nvdaProcess.kill("SIGKILL");
      } catch {
        // swallow
      }

      if (attempt === MAX_START_ATTEMPTS - 1) {
        throw e;
      }
    }
  }
}
