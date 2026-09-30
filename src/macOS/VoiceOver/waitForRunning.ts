import type { CommandOptions } from "../../CommandOptions";
import { DEFAULT_RUNNING_TIMEOUT } from "../../constants";
import { ERR_VOICE_OVER_RUNNING_TIMEOUT } from "../errors";
import { isRunning } from "./isRunning";
import { waitForCondition } from "../../waitForCondition";

export async function waitForRunning(options?: CommandOptions): Promise<void> {
  return await waitForCondition(async () => await isRunning(options), {
    pollTimeout: DEFAULT_RUNNING_TIMEOUT,
    timeoutErrorMessage: ERR_VOICE_OVER_RUNNING_TIMEOUT,
  });
}
