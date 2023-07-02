export interface CommandOptions {
  /**
   * Whether to capture the screen reader output:
   *
   * - `true` will enabled full capture.
   * - `"initial"` will capture the first "page" of output, but not any
   * subsequent content.
   * - `false` will disable capture.
   *
   * Default is `true`.
   */
  capture?: true | false | "initial";

  /**
   * Number of times to retry.
   */
  retries?: number;

  /**
   * How long to wait until the command times out in ms.
   */
  timeout?: number;
}
