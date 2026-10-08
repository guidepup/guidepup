import { DEFAULT_RUNNING_TIMEOUT } from "../../constants";
import { ERR_NVDA_RUNNING_TIMEOUT } from "../errors";
import { isRunning } from "./isRunning";
import { waitForCondition } from "../../waitForCondition";

export async function waitForRunning(): Promise<void> {
  return await waitForCondition(() => isRunning(), {
    pollTimeout: DEFAULT_RUNNING_TIMEOUT,
    timeoutErrorMessage: ERR_NVDA_RUNNING_TIMEOUT,
  });
}
