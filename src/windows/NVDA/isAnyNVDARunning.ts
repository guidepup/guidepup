import { DEFAULT_RUNNING_TIMEOUT } from "../../constants";
import { ERR_NVDA_NOT_INSTALLED } from "../errors";
import { execFile } from "child_process";
import { getNVDAInstallationPath } from "./getNVDAInstallationPath";

/**
 * Whether any copy of NVDA is running, including one that Guidepup did not
 * start, such as the user's installed NVDA.
 *
 * `nvda.exe --check-running` exits with 0 when an NVDA is running and with 1
 * when none is. Unlike every other NVDA start, it does not quit the running
 * copy.
 */
export async function isAnyNVDARunning(): Promise<boolean> {
  const executablePath = getNVDAInstallationPath();

  if (!executablePath) {
    throw new Error(ERR_NVDA_NOT_INSTALLED);
  }

  return new Promise((resolve, reject) => {
    execFile(
      executablePath,
      ["--check-running"],
      { timeout: DEFAULT_RUNNING_TIMEOUT },
      (error) => {
        if (!error) {
          return resolve(true);
        }

        if (error.code === 1) {
          return resolve(false);
        }

        reject(error);
      },
    );
  });
}
