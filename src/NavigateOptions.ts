import type { CommandOptions } from "./CommandOptions";

export interface NavigateOptions extends CommandOptions {
  /** Maximum number of navigation commands before the search fails. */
  maxNavigationAttempts: number;
}
