import type { CommandOptions } from "../../CommandOptions";
import { waitForCondition } from "../../waitForCondition";
import { isRunning } from "./isRunning";
import { ERR_VOICE_OVER_RUNNING_TIMEOUT } from "../errors";

export async function waitForRunning(options?: CommandOptions): Promise<void> {
  return await waitForCondition(async () => await isRunning(options), {
    timeoutErrorMessage: ERR_VOICE_OVER_RUNNING_TIMEOUT,
  });
}
