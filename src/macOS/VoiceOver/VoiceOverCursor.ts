import { Applications } from "../Applications";
import type { CommandOptions } from "../../CommandOptions";
import { Directions } from "./Directions";
import { keyCodeCommands } from "./keyCodeCommands";
import { LogStore } from "../../LogStore";
import { move } from "./move";
import { performAction } from "./performAction";
import type { ScreenReaderCursor } from "../../ScreenReaderCursor";
import { sendKeys } from "../sendKeys";
import { takeScreenshot } from "./takeScreenshot";

export class VoiceOverCursor implements ScreenReaderCursor {
  /**
   * @ignore
   */
  #logStore: LogStore;

  constructor(logStore: LogStore) {
    this.#logStore = logStore;
  }

  /**
   * Move the VoiceOver cursor to the previous location.
   *
   * Equivalent of executing VO-Left Arrow.
   *
   * @param {object} [options] Additional options.
   */
  async previous(options?: CommandOptions): Promise<void> {
    return await this.#logStore.tap(move(Directions.Left, undefined, options));
  }

  /**
   * Move the VoiceOver cursor to the next location.
   *
   * Equivalent of executing VO-Right Arrow.
   *
   * @param {object} [options] Additional options.
   */
  async next(options?: CommandOptions): Promise<void> {
    return await this.#logStore.tap(move(Directions.Right, undefined, options));
  }

  /**
   * Perform the default action for the item in the VoiceOver cursor.
   *
   * @param {object} [options] Additional options.
   */
  async act(options?: CommandOptions): Promise<void> {
    return await this.#logStore.tap(performAction(options));
  }

  /**
   * Interact with the item under the ScreenReader cursor.
   *
   * Equivalent of executing VO-Shift-Down Arrow.
   *
   * @param {object} [options] Additional options.
   */
  async interact(options?: CommandOptions): Promise<void> {
    return await this.#logStore.tap(
      sendKeys(
        keyCodeCommands.interactWithItem,
        Applications.VoiceOver,
        options
      )
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
    return await this.#logStore.tap(
      sendKeys(
        keyCodeCommands.stopInteractingWithItem,
        Applications.VoiceOver,
        options
      )
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
