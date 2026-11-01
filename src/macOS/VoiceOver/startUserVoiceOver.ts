import { DEFAULT_RUNNING_TIMEOUT } from "../../constants";
import { ERR_VOICE_OVER_RUNNING_TIMEOUT } from "../errors";
import { isRunning } from "./isRunning";
import { requestStart } from "./start";
import { waitForCondition } from "../../waitForCondition";

/**
 * Start the user's own VoiceOver again, for example after Guidepup quit it to
 * run VoiceOver with its own preferences.
 *
 * Resolves once the VoiceOver process is running, so a following
 * `voiceOver.start()` sees it. It does not wait for VoiceOver to answer
 * AppleEvents, which can take 10s or more.
 */
export async function startUserVoiceOver(): Promise<void> {
  requestStart();

  await waitForCondition(() => isRunning(undefined, true), {
    pollTimeout: DEFAULT_RUNNING_TIMEOUT,
    timeoutErrorMessage: ERR_VOICE_OVER_RUNNING_TIMEOUT,
  });
}
