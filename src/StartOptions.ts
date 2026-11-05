import { CommandOptions } from "./CommandOptions";

export interface StartOptions extends CommandOptions {
  /**
   * Screen reader settings to apply on startup.
   */
  settings?: Record<string, unknown>;

  /**
   * Whether `stop()` starts the user's own screen reader again when `start()`
   * had to quit it. Supported by NVDA, Orca and VoiceOver.
   *
   * Default is `true`.
   */
  restoreUserScreenReader?: boolean;
}
