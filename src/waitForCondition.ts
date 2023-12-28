import {
  DEFAULT_POLL_INTERVAL,
  DEFAULT_TIMEOUT,
  ERR_WAITING_TIMEOUT,
} from "./constants";

async function resolveWhenTrue(
  condition: () => boolean | Promise<boolean>,
  pollInterval: number,
  signal: AbortSignal
): Promise<void> {
  let result;

  try {
    result = await condition();
  } catch {
    result = false;
  }

  if (result || signal.aborted) {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, pollInterval));

  await resolveWhenTrue(condition, pollInterval, signal);
}

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
  let timeoutTimerId: NodeJS.Timeout | undefined;

  const controller = new AbortController();

  await Promise.race([
    resolveWhenTrue(condition, pollInterval, controller.signal),
    new Promise<void>((_, reject) => {
      timeoutTimerId = setTimeout(() => {
        controller.abort();
        reject(new Error(timeoutErrorMessage));
      }, pollTimeout);
    }),
  ]);

  clearTimeout(timeoutTimerId);
  timeoutTimerId = undefined;
}
