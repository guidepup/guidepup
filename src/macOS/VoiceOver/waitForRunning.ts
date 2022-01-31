import type { CommandOptions } from "../../CommandOptions";
import { ERR_VOICE_OVER_RUNNING_TIMEOUT } from "../errors";
import { isRunning } from "./isRunning";
import { waitForCondition } from "../../waitForCondition";

export async function waitForRunning(options?: CommandOptions): Promise<void> {
  return await waitForCondition(async () => await isRunning(options), {
    timeoutErrorMessage: ERR_VOICE_OVER_RUNNING_TIMEOUT,
  });
}
