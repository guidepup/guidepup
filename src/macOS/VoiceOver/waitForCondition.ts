import "@jxa/global-type";

const POLL_INTERVAL = 100;
const POLL_TIMEOUT = 5000;

const TIMEOUT_ERROR_MESSAGE = "Timed out waiting.";

export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  {
    pollInterval = POLL_INTERVAL,
    pollTimeout = POLL_TIMEOUT,
    timeoutErrorMessage = TIMEOUT_ERROR_MESSAGE,
  } = {
    pollInterval: POLL_INTERVAL,
    pollTimeout: POLL_TIMEOUT,
    timeoutErrorMessage: TIMEOUT_ERROR_MESSAGE,
  }
): Promise<void> {
  let pollIntervalId: NodeJS.Timer | undefined;
  let pollTimeoutId: NodeJS.Timer | undefined;

  await Promise.race([
    new Promise<void>((resolve) => {
      pollIntervalId = setInterval(async () => {
        if (await condition()) {
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
