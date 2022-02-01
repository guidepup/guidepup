import { CommandOptions } from "./CommandOptions";

export interface KeyboardOptions extends CommandOptions {
  /**
   * Optional identifier for target application.
   * 
   * If not provided, the current focused application will be targeted.
   */
  application?: string;
}
