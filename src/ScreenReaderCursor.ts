import type { CommandOptions } from "./CommandOptions";

export interface ScreenReaderCursor {
  /**
   * Move the ScreenReader cursor to the previous location.
   *
   * @param {object} [options] Additional options.
   */
  previous(options?: CommandOptions): Promise<void>;

  /**
   * Move the ScreenReader cursor to the next location.
   *
   * @param {object} [options] Additional options.
   */
  next(options?: CommandOptions): Promise<void>;

  /**
   * Perform the default action for the item in the ScreenReader cursor.
   *
   * @param {object} [options] Additional options.
   */
  act(options?: CommandOptions): Promise<void>;

  /**
   * Interact with the item under the ScreenReader cursor.
   *
   * @param {object} [options] Additional options.
   */
  interact(options?: CommandOptions): Promise<void>;

  /**
   * Stop interacting with the current item.
   *
   * @param {object} [options] Additional options.
   */
  stopInteracting(options?: CommandOptions): Promise<void>;
}
