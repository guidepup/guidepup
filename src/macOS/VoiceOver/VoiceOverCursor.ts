import { Applications } from "../Applications";
import type { CommandOptions } from "../../CommandOptions";
import { Directions } from "./Directions";
import { keyCodeCommands } from "./keyCodeCommands";
import { move } from "./move";
import { performAction } from "./performAction";
import { sendKeys } from "../sendKeys";
import { takeScreenshot } from "./takeScreenshot";
import { VoiceOverClient } from "./VoiceOverClient";

export class VoiceOverCursor {
  /**
   * @ignore
   */
  #voiceOverClient: VoiceOverClient;

  constructor(voiceOverClient: VoiceOverClient) {
    this.#voiceOverClient = voiceOverClient;
  }

  /**
   * Move the VoiceOver cursor to the previous location.
   *
   * Equivalent of executing VO-Left Arrow.
   *
   * @param {object} [options] Additional options.
   */
  async previous(options?: CommandOptions): Promise<void> {
    return await this.#voiceOverClient.enqueueAndTap(
      () => move(Directions.Left, undefined, options),
      options,
    );
  }

  /**
   * Move the VoiceOver cursor to the next location.
   *
   * Equivalent of executing VO-Right Arrow.
   *
   * @param {object} [options] Additional options.
   */
  async next(options?: CommandOptions): Promise<void> {
    return await this.#voiceOverClient.enqueueAndTap(
      () => move(Directions.Right, undefined, options),
      options,
    );
  }

  /**
   * Perform the default action for the item in the VoiceOver cursor.
   *
   * @param {object} [options] Additional options.
   */
  async act(options?: CommandOptions): Promise<void> {
    return await this.#voiceOverClient.enqueueAndTap(
      () => performAction(options),
      options,
    );
  }

  /**
   * Interact with the item under the VoiceOver cursor.
   *
   * Equivalent of executing VO-Shift-Down Arrow.
   *
   * @param {object} [options] Additional options.
   */
  async interact(options?: CommandOptions): Promise<void> {
    return await this.#voiceOverClient.enqueueAndTap(
      () =>
        sendKeys(
          keyCodeCommands.interactWithItem,
          Applications.VoiceOver,
          options,
        ),
      options,
    );
  }

  /**
   * Stop interacting with the current item.
   *
   * Equivalent of executing VO-Shift-Up Arrow.
   *
   * @param {object} [options] Additional options.
   */
  async stopInteracting(options?: CommandOptions): Promise<void> {
    return await this.#voiceOverClient.enqueueAndTap(
      () =>
        sendKeys(
          keyCodeCommands.stopInteractingWithItem,
          Applications.VoiceOver,
          options,
        ),
      options,
    );
  }

  /**
   * Takes a screenshot of the VoiceOver cursor and returns the path to screenshot file.
   *
   * @param {object} [options] Additional options.
   * @returns {Promise<string>} The path to the screenshot file.
   */
  async takeScreenshot(options?: CommandOptions): Promise<string> {
    return await takeScreenshot(options);
  }
}
