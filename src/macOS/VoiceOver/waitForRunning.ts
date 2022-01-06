import type { Options } from "../types";
import { waitForCondition } from "../../waitForCondition";
import { isRunning } from "./isRunning";
import { ERR_VOICE_OVER_RUNNING_TIMEOUT } from "../errors";

export async function waitForRunning(options?: Options): Promise<void> {
  return await waitForCondition(async () => await isRunning(options), {
    timeoutErrorMessage: ERR_VOICE_OVER_RUNNING_TIMEOUT,
  });
}
