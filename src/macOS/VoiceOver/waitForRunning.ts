import { waitForCondition } from "./waitForCondition";
import { isRunning } from "./isRunning";

const ERR_TIMEOUT = "Timed out waiting for VoiceOver to be running";

export async function waitForRunning(): Promise<void> {
  return await waitForCondition(isRunning, {
    timeoutErrorMessage: ERR_TIMEOUT,
  });
}
