import { click } from "./click";
import type { ClickOptions } from "../../ClickOptions";
import { VoiceOverClient } from "./VoiceOverClient";

export class VoiceOverMouse {
  /**
   * @ignore
   */
  #voiceOverClient: VoiceOverClient;

  constructor(voiceOverClient: VoiceOverClient) {
    this.#voiceOverClient = voiceOverClient;
  }

  /**
   * Click the mouse.
   *
   * @param {object} [options] Click options.
   */
  async click(options?: ClickOptions): Promise<void> {
    return await this.#voiceOverClient.enqueueAndTap(
      () => click(options),
      options,
    );
  }
}
