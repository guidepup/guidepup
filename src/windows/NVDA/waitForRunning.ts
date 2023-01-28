import { ERR_NVDA_RUNNING_TIMEOUT } from "../errors";
import { isRunning } from "./isRunning";
import { waitForCondition } from "../../waitForCondition";

const NVDA_RUNNING_TIMEOUT = 30000;

export async function waitForRunning(): Promise<void> {
  return await waitForCondition(() => isRunning(), {
    pollTimeout: NVDA_RUNNING_TIMEOUT,
    timeoutErrorMessage: ERR_NVDA_RUNNING_TIMEOUT,
  });
}
