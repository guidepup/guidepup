import { click } from "./click";
import type { ClickOptions } from "../../ClickOptions";
import { LogStore } from "./LogStore";

export class VoiceOverMouse {
  /**
   * @ignore
   */
  #logStore: LogStore;

  constructor(logStore: LogStore) {
    this.#logStore = logStore;
  }

  /**
   * Click the mouse.
   *
   * @param {object} [options] Click options.
   */
  async click(options?: ClickOptions): Promise<void> {
    return await this.#logStore.tap(() => click(options));
  }
}
