import { CommandOptions } from "./CommandOptions";

export interface StartOptions extends CommandOptions {
  /**
   * Screen reader settings to apply on startup.
   */
  settings?: Record<string, unknown>;
}
