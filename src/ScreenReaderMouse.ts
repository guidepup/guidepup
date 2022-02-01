import type { ClickOptions } from "./ClickOptions";

export interface ScreenReaderMouse {
  /**
   * Click the mouse.
   *
   * @param {object} [options] Click options.
   */
  click(options?: ClickOptions): Promise<void>;
}
