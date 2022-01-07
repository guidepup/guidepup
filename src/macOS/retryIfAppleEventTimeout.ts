import { RETRY_COUNT } from "../constants";

export async function retryIfAppleEventTimeout<T>(
  delegate: () => T | Promise<T>,
  { retries = RETRY_COUNT } = { retries: RETRY_COUNT }
): Promise<T> {
  let error: Error;

  for (let i = 0; i < retries; i++) {
    try {
      return await delegate();
    } catch (e) {
      error = e;

      if (!e.message.includes("AppleEvent timed out")) {
        break;
      }
    }
  }

  throw error;
}
