import type { ScreenReader } from "../../ScreenReader";
import { decorateStaticImplements } from "../../decorateStaticImplements";
import { isWindows } from "../isWindows";
import { isNVDAInstalled } from "./isNVDAInstalled";
import { start } from "./start";
import { quit } from "./quit";

/**
 * Class for controlling the NVDA ScreenReader on MacOS.
 */
// @decorateStaticImplements<ScreenReader>()
export class NVDA {
  #log = false;
  #spokenPhraseLog = [];
  #itemTextLog = [];

  async #tap<T, S extends Promise<T>>(promise: S): Promise<T> {
    const result = await promise;

    if (this.#log) {
      // TODO: store last logs
    }

    return result;
  }

  /**
   * Detect whether NVDA is supported for the current OS.
   *
   * @returns {boolean}
   */
  static detect(): boolean {
    return isWindows() && isNVDAInstalled();
  }

  /**
   * Detect whether NVDA is the default screen reader for the current OS.
   *
   * @returns {boolean}
   */
  static default(): boolean {
    return false;
  }

  /**
   * Turn NVDA on.
   */
  async start(): Promise<void> {
    await start();
  }

  /**
   * Turn NVDA off.
   */
  async stop(): Promise<void> {
    await quit();
  }

  /**
   * Get the log of all visited item text for this NVDA instance.
   *
   * Note `vo.startLog()` must first be called for item text to be logged.
   *
   * @returns {Promise<string[]>} The item text log.
   */
  async getItemTextLog(): Promise<string[]> {
    return this.#itemTextLog;
  }

  /**
   * Get the log of all spoken phrases for this NVDA instance.
   *
   * Note `vo.startLog()` must first be called for spoken phrases to be logged.
   *
   * @returns {Promise<string[]>} The phrase log.
   */
  async getSpokenPhraseLog(): Promise<string[]> {
    return this.#spokenPhraseLog;
  }

  /**
   * Start logging spoken phrases and item text.
   */
  startLog(): void {
    this.#log = true;
  }

  /**
   * Stop logging spoken phrases and item text.
   */
  stopLog(): void {
    this.#log = false;
  }
}
