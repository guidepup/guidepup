import {
  ERR_NVDA_NOT_INSTALLED,
  ERR_NVDA_QUIT,
  ERR_NVDA_QUIT_TIMEOUT,
} from "../errors";
import { DEFAULT_RUNNING_TIMEOUT } from "../../constants";
import { getGuidepupNVDAInstallationPath } from "./getGuidepupNVDAInstallationPath";
import { spawnSync } from "child_process";

export function quit(): void {
  const executablePath = getGuidepupNVDAInstallationPath();

  if (!executablePath) {
    throw new Error(ERR_NVDA_NOT_INSTALLED);
  }

  let result: ReturnType<typeof spawnSync>;

  try {
    result = spawnSync(executablePath, ["--quit"], {
      stdio: "ignore",
      timeout: DEFAULT_RUNNING_TIMEOUT,
    });
  } catch (cause) {
    throw new Error(ERR_NVDA_QUIT, { cause });
  }

  // spawnSync reports a timeout or a failed spawn in `error`, it does not throw.
  if (result.error) {
    const timedOut =
      (result.error as NodeJS.ErrnoException).code === "ETIMEDOUT";

    throw new Error(timedOut ? ERR_NVDA_QUIT_TIMEOUT : ERR_NVDA_QUIT, {
      cause: result.error,
    });
  }
}
