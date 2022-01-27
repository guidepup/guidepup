import {
  DEFAULT_MUTATING_ACTION_RETRY_COUNT,
  APPLE_SCRIPT_TIMED_OUT_ERR_SNIPPET,
} from "../constants";

export async function retryIfAppleEventTimeout<T>(
  delegate: () => T | Promise<T>,
  { retries = DEFAULT_MUTATING_ACTION_RETRY_COUNT } = {
    retries: DEFAULT_MUTATING_ACTION_RETRY_COUNT,
  }
): Promise<T> {
  let error: Error;

  for (let i = 0; i < retries; i++) {
    try {
      return await delegate();
    } catch (e) {
      error = e;

      if (!e.message.includes(APPLE_SCRIPT_TIMED_OUT_ERR_SNIPPET)) {
        break;
      }
    }
  }

  throw error;
}
