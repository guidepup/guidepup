import type { CommandOptions } from "./CommandOptions";

export interface ScreenReaderCursor {
  /**
   * Move the ScreenReader cursor to the previous location.
   */
  previous(options?: CommandOptions): Promise<void>;

  /**
   * Move the ScreenReader cursor to the next location.
   */
  next(options?: CommandOptions): Promise<void>;

  /**
   * Perform the default action for the item in the ScreenReader cursor.
   */
  act(options?: CommandOptions): Promise<void>;

  /**
   * Interact with the item under the ScreenReader cursor.
   */
  interact(options?: CommandOptions): Promise<void>;

  /**
   * Stop interacting with the current item.
   */
  stopInteracting(options?: CommandOptions): Promise<void>;
}
