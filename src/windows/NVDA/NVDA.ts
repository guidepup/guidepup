import { ERR_NVDA_NOT_SUPPORTED } from "../errors";
import { isNVDAInstalled } from "./isNVDAInstalled";
import { isWindows } from "../isWindows";
import { keyCodeCommands } from "./keyCodeCommands";
import { KeyCodes } from "../KeyCodes";
import { NVDAStream } from "./NVDAStream";
import { quit } from "./quit";
import { sendKeys } from "../sendKeys";
import { start } from "./start";

/**
 * Class for controlling the NVDA ScreenReader on MacOS.
 */
export class NVDA {
  #stream: NVDAStream;

  constructor() {
    this.#stream = new NVDAStream();
  }

  /**
   * Detect whether NVDA is supported for the current OS.
   *
   * @returns {Promise<boolean>}
   */
  static async detect(): Promise<boolean> {
    return (await isWindows()) && (await isNVDAInstalled());
  }

  /**
   * Detect whether NVDA is the default screen reader for the current OS.
   *
   * @returns {Promise<boolean>}
   */
  static async default(): Promise<boolean> {
    return await Promise.resolve(false);
  }

  /**
   * Turn NVDA on.
   */
  async start(): Promise<void> {
    if (!(await NVDA.detect())) {
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
    return await this.#stream.sendKeyCode(keyCodeCommands.moveToPrevious);
  }

  /**
   * Move the NVDA cursor to the next location.
   *
   * Equivalent of executing Down Arrow.
   */
  async next(): Promise<void> {
    return await this.#stream.sendKeyCode(keyCodeCommands.moveToNext);
  }

  async type(text: string) {
    return await sendKeys({ characters: text });
  }

  async act() {
    return await sendKeys({ keyCode: KeyCodes.KEY_ENTER });
  }

  /**
   * Get the last spoken phrase.
   *
   * @returns {string} The last spoken phrase.
   */
  lastSpokenPhrase(): string {
    return this.#stream.lastSpokenPhrase();
  }

  /**
   * Get the log of all spoken phrases for this NVDA instance.
   *
   * @returns {string[]} The spoken phrase log.
   */
  spokenPhraseLog(): string[] {
    return this.#stream.spokenPhraseLog();
  }
}
