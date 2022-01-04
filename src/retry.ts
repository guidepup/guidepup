import { RETRY_COUNT } from "./constants";

export async function retry<T, S extends T | Promise<T>>(
  promise: S,
  { count = RETRY_COUNT } = { count: RETRY_COUNT }
): Promise<T> {
  let error: Error;

  for (let i = 0; i < count; i++) {
    try {
      return await promise;
    } catch (e) {
      error = e;
    }
  }

  throw error;
}
