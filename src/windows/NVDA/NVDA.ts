import type { ScreenReader } from "../../ScreenReader";
import { decorateStaticImplements } from "../../decorateStaticImplements";
import { isWindows } from "../isWindows";
import { isNVDAInstalled } from "./isNVDAInstalled";
import { start } from "./start";
import { quit } from "./quit";
import { KeyCodeCommand } from "../KeyCodeCommand";
import { sendKeys } from "../sendKeys";
import { KeystrokeCommand } from "../KeystrokeCommand";

/**
 * Class for controlling the NVDA ScreenReader on MacOS.
 */
@decorateStaticImplements<ScreenReader>()
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

  static ERR_NVDA_NOT_SUPPORTED = "NVDA not supported";

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
    if (!NVDA.detect()) {
      throw new Error(NVDA.ERR_NVDA_NOT_SUPPORTED);
    }

    await start();
  }

  /**
   * Turn NVDA off.
   */
  async stop(): Promise<void> {
    await quit();
  }

  /**
   * Send a key code to NVDA.
   *
   * @param {object} keyCodeCommand Key code command to send to NVDA.
   */
  async keyCode(keyCodeCommand: KeyCodeCommand): Promise<void> {
    return await this.#tap(sendKeys(keyCodeCommand));
  }

  /**
   * Send a keystroke to NVDA.
   *
   * @param {object} keystrokeCommand Keystroke command to send to NVDA.
   */
  async keystroke(keystrokeCommand: KeystrokeCommand): Promise<void> {
    return await this.#tap(sendKeys(keystrokeCommand));
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
