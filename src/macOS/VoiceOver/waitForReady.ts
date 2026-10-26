import {
  DEFAULT_RUNNING_TIMEOUT,
  ERR_APPLE_SCRIPT_APPLICATION_NOT_RUNNING,
  ERR_APPLE_SCRIPT_TIMED_OUT,
} from "../../constants";
import { Applications } from "../Applications";
import type { CommandOptions } from "../../CommandOptions";
import { ERR_VOICE_OVER_RUNNING_TIMEOUT } from "../errors";
import { isRunning } from "./isRunning";
import { runAppleScript } from "../runAppleScript";
import { waitForCondition } from "../../waitForCondition";

const PROBE_TIMEOUT = 1000;

/**
 * Waits until VoiceOver answers an AppleEvent itself. Unlike `isRunning()`,
 * whose `running` check AppleScript answers without asking VoiceOver, this
 * only succeeds once VoiceOver has finished starting.
 */
export async function waitForReady(options?: CommandOptions): Promise<void> {
  return await waitForCondition(
    async () => {
      // Only address VoiceOver once its process exists, so that the probe
      // can't launch it.
      if (!(await isRunning(options, true))) {
        return false;
      }

      try {
        await runAppleScript(
          `tell application "${Applications.VoiceOver}"\nreturn enabled of caption window\nend tell`,
          { timeout: PROBE_TIMEOUT },
        );
      } catch (error) {
        // Any other error came from VoiceOver itself, so it is ready.
        return !(
          error.message.includes(ERR_APPLE_SCRIPT_APPLICATION_NOT_RUNNING) ||
          error.message.includes(ERR_APPLE_SCRIPT_TIMED_OUT)
        );
      }

      return true;
    },
    {
      pollTimeout: DEFAULT_RUNNING_TIMEOUT,
      timeoutErrorMessage: ERR_VOICE_OVER_RUNNING_TIMEOUT,
    },
  );
}
