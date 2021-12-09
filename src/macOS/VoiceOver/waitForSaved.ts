import "@jxa/global-type";
import { isSaved } from "./isSaved";
import { waitForCondition } from "./waitForCondition";

const TIMEOUT_ERROR_MESSAGE = "Timed out waiting for VoiceOver to save file.";
const ONE_SECOND = 1000;
const TWENTY_SECONDS = 20000;

export async function waitForSaved(): Promise<void> {
  return await waitForCondition(isSaved, {
    timeoutErrorMessage: TIMEOUT_ERROR_MESSAGE,
    pollInterval: ONE_SECOND,
    pollTimeout: TWENTY_SECONDS,
  });
}
