export interface CommandOptions {
  /**
   * How long to wait until the command times out in ms.
   */
  timeout?: number;

  /**
   * Number of times to retry.
   */
  retries?: number;
}
