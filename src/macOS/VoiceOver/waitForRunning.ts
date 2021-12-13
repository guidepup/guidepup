import { waitForCondition } from "./waitForCondition";
import { isRunning } from "./isRunning";

const TIMEOUT_ERROR_MESSAGE = "Timed out waiting for VoiceOver to be running.";

export async function waitForRunning(): Promise<void> {
  return await waitForCondition(isRunning, {
    timeoutErrorMessage: TIMEOUT_ERROR_MESSAGE,
  });
}
