import { ERR_NVDA_NOT_SUPPORTED } from "../errors";
import { isNVDAInstalled } from "./isNVDAInstalled";
import { isWindows } from "../isWindows";
import { keyCodeCommands } from "./keyCodeCommands";
import { NVDAStream } from "./NVDAStream";
import { quit } from "./quit";
import type { ScreenReader } from "../../ScreenReader";
import { sendKeys } from "../sendKeys";
import { start } from "./start";

/**
 * Class for controlling the NVDA ScreenReader on MacOS.
 */
export class NVDA implements ScreenReader {
  #stream: NVDAStream;

  /**
   * NVDA caption APIs.
   */
  caption!: any;

  /**
   * NVDA cursor APIs.
   */
  cursor!: any;

  /**
   * NVDA keyboard APIs.
   */
  keyboard!: any;

  /**
   * NVDA mouse APIs.
   */
  mouse!: any;

  constructor() {
    this.#stream = new NVDAStream();
  }

  /**
   * Detect whether NVDA is supported for the current OS.
   *
   * @returns {Promise<boolean>}
   */
  async detect(): Promise<boolean> {
    return Promise.resolve(isWindows() && isNVDAInstalled());
  }

  /**
   * Detect whether NVDA is the default screen reader for the current OS.
   *
   * @returns {Promise<boolean>}
   */
  async default(): Promise<boolean> {
    return await Promise.resolve(isWindows());
  }

  /**
   * Turn NVDA on.
   */
  async start(): Promise<void> {
    if (!(await this.detect())) {
      throw new Error(ERR_NVDA_NOT_SUPPORTED);
    }

    await start();
    await this.#stream.start();
  }

  /**
   * Turn NVDA off.
   */
  async stop(): Promise<void> {
    this.#stream.stop();
    await quit();
  }

  /**
   * Move the NVDA cursor to the previous location.
   *
   * Equivalent of executing Up Arrow.
   */
  async previous(): Promise<void> {
    return await this.#stream.waitForSpokenPhrase(() =>
      this.#stream.sendKeyCode(keyCodeCommands.moveToPrevious)
    );
  }

  /**
   * Move the NVDA cursor to the next location.
   *
   * Equivalent of executing Down Arrow.
   */
  async next(): Promise<void> {
    return await this.#stream.waitForSpokenPhrase(() =>
      this.#stream.sendKeyCode(keyCodeCommands.moveToNext)
    );
  }

  /**
   * Perform the default action for the item in the NVDA cursor.
   *
   * Equivalent of executing Enter.
   */
  async act() {
    return await this.#stream.waitForSpokenPhrase(() =>
      this.#stream.sendKeyCode(keyCodeCommands.activate)
    );
  }

  /**
   * No-op to provide same API across screen-readers.
   *
   * NVDA does not require users to perform an additional command to interact
   * with the item in the NVDA cursor.
   */
  async interact(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * No-op to provide same API across screen-readers.
   *
   * NVDA does not require users to perform an additional command to interact
   * with the item in the NVDA cursor.
   */
  async stopInteracting(): Promise<void> {
    return await Promise.resolve();
  }

  async press(): Promise<void> {
    return await Promise.resolve();
  }

  /**
   * Type text into the focused item.
   *
   * ```ts
   * await nvda.type("my-username");
   * ```
   *
   * @param {string} text Text to type into the focused item.
   * @param {object} [options] Additional options.
   */
  async type(text: string) {
    return await this.#stream.waitForSpokenPhrase(() =>
      sendKeys({ characters: text })
    );
  }

  /**
   * Perform a NVDA command.
   *
   * @param {any} command NVDA keyboard command or commander command to execute.
   */
  async perform(): Promise<void> {
    return await Promise.resolve();
  }

  /**
   * Click the mouse.
   */
  async click(): Promise<void> {
    return await Promise.resolve();
  }

  /**
   * Get the last spoken phrase.
   *
   * @returns {string} The last spoken phrase.
   */
  async lastSpokenPhrase(): Promise<string> {
    return await Promise.resolve(this.#stream.lastSpokenPhrase());
  }

  /**
   * Get the text of the item in the NVDA cursor.
   *
   * @returns {Promise<string>} The item's text.
   */
  async itemText(): Promise<string> {
    return await Promise.resolve("");
  }

  /**
   * Get the log of all spoken phrases for this NVDA instance.
   *
   * @returns {string[]} The spoken phrase log.
   */
  spokenPhraseLog(): string[] {
    return this.#stream.spokenPhraseLog();
  }

  /**
   * Get the log of all visited item text for this NVDA instance.
   *
   * @returns {string[]} The item text log.
   */
  itemTextLog(): string[] {
    return [];
  }
}
