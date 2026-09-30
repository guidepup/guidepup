import type { CommandOptions } from "../../CommandOptions";
import { DEFAULT_RUNNING_TIMEOUT } from "../../constants";
import { ERR_VOICE_OVER_NOT_RUNNING_TIMEOUT } from "../errors";
import { isRunning } from "./isRunning";
import { waitForCondition } from "../../waitForCondition";

export async function waitForNotRunning(
  options?: CommandOptions,
): Promise<void> {
  return await waitForCondition(async () => !(await isRunning(options, true)), {
    pollTimeout: DEFAULT_RUNNING_TIMEOUT,
    timeoutErrorMessage: ERR_VOICE_OVER_NOT_RUNNING_TIMEOUT,
  });
}
