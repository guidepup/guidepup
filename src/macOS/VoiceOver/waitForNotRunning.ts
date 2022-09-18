import type { CommandOptions } from "../../CommandOptions";
import { ERR_VOICE_OVER_NOT_RUNNING_TIMEOUT } from "../errors";
import { isRunning } from "./isRunning";
import { waitForCondition } from "../../waitForCondition";

export async function waitForNotRunning(options?: CommandOptions): Promise<void> {
  return await waitForCondition(async () => !(await isRunning(options)), {
    timeoutErrorMessage: ERR_VOICE_OVER_NOT_RUNNING_TIMEOUT,
  });
}
