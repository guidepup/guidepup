import {
  ERR_WAITING_TIMEOUT,
  DEFAULT_POLL_INTERVAL,
  DEFAULT_TIMEOUT,
} from "./constants";

export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  {
    pollInterval = DEFAULT_POLL_INTERVAL,
    pollTimeout = DEFAULT_TIMEOUT,
    timeoutErrorMessage = ERR_WAITING_TIMEOUT,
  } = {
    pollInterval: DEFAULT_POLL_INTERVAL,
    pollTimeout: DEFAULT_TIMEOUT,
    timeoutErrorMessage: ERR_WAITING_TIMEOUT,
  }
): Promise<void> {
  let pollIntervalId: NodeJS.Timer | undefined;
  let pollTimeoutId: NodeJS.Timer | undefined;

  await Promise.race([
    new Promise<void>((resolve) => {
      pollIntervalId = setInterval(async () => {
        let result;

        try {
          result = await condition();
        } catch (_) {
          result = false;
        }

        if (result) {
          clearTimeout(pollTimeoutId);
          clearInterval(pollIntervalId);
          pollTimeoutId = undefined;
          pollIntervalId = undefined;
          resolve();
        }
      }, pollInterval);
    }),
    new Promise<void>((_, reject) => {
      pollTimeoutId = setTimeout(() => {
        clearInterval(pollIntervalId);
        pollTimeoutId = undefined;
        pollIntervalId = undefined;

        reject(new Error(timeoutErrorMessage));
      }, pollTimeout);
    }),
  ]);
}
