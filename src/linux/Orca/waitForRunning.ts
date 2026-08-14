import { ERR_ORCA_RUNNING_TIMEOUT } from "../errors";
import { isRunning } from "./isRunning";
import { waitForCondition } from "../../waitForCondition";

const ORCA_RUNNING_TIMEOUT = 30000;

export async function waitForRunning(): Promise<void> {
  return await waitForCondition(() => isRunning(), {
    pollTimeout: ORCA_RUNNING_TIMEOUT,
    timeoutErrorMessage: ERR_ORCA_RUNNING_TIMEOUT,
  });
}
