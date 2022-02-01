import type { CommandOptions } from "./CommandOptions";

export interface ClickOptions extends CommandOptions {
  /**
   * Defaults to `left`.
   */
  button?: "left" | "right";

  /**
   * Defaults to 1.
   */
  clickCount?: 1 | 2 | 3;
}
