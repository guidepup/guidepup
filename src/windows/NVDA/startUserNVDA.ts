import { ERR_NVDA_CANNOT_BE_STARTED, ERR_NVDA_RUNNING_TIMEOUT } from "../errors";
import { DEFAULT_RUNNING_TIMEOUT } from "../../constants";
import { isAnyNVDARunning } from "./isAnyNVDARunning";
import { runVbsScript } from "../runVbsScript";
import { waitForCondition } from "../../waitForCondition";

/**
 * Start the user's own NVDA again, for example after Guidepup quit it to run
 * its portable NVDA.
 *
 * NVDA is started through the Windows shell, as a shortcut does. A process
 * that Node spawns directly does not get UIAccess, so NVDA could not read or
 * control elevated applications.
 *
 * Resolves once NVDA is running, so a following `nvda.start()` sees it and
 * does not race its start up.
 */
export async function startUserNVDA(executablePath: string): Promise<void> {
  const escapedExecutablePath = executablePath.replaceAll('"', '""');
  const script = `set WshShell = CreateObject("WScript.Shell")\nWshShell.Run """${escapedExecutablePath}""",1,False\nset WshShell = Nothing`;

  try {
    await runVbsScript(script);

    await waitForCondition(() => isAnyNVDARunning(), {
      pollTimeout: DEFAULT_RUNNING_TIMEOUT,
      timeoutErrorMessage: ERR_NVDA_RUNNING_TIMEOUT,
    });
  } catch (cause) {
    throw new Error(ERR_NVDA_CANNOT_BE_STARTED, { cause });
  }
}
