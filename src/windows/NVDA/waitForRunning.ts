import { ERR_NVDA_RUNNING_TIMEOUT } from "../errors";
import { isRunning } from "./isRunning";
import { waitForCondition } from "../../waitForCondition";

export async function waitForRunning(): Promise<void> {
  return await waitForCondition(() => isRunning(), {
    timeoutErrorMessage: ERR_NVDA_RUNNING_TIMEOUT,
  });
}
