import { waitForCondition } from "../../waitForCondition";
import { isRunning } from "./isRunning";
import { ERR_VOICE_OVER_RUNNING_TIMEOUT } from "../errors";

export async function waitForRunning(): Promise<void> {
  return await waitForCondition(isRunning, {
    timeoutErrorMessage: ERR_VOICE_OVER_RUNNING_TIMEOUT,
  });
}
