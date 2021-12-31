import type { ScreenReader } from "../../ScreenReader";
import { decorateStaticImplements } from "../../decorateStaticImplements";
import { isWindows } from "../isWindows";
import { isNVDAInstalled } from "./isNVDAInstalled";
import { start } from "./start";
import { quit } from "./quit";
import { KeyCodeCommand } from "../KeyCodeCommand";
import { sendKeys } from "../sendKeys";
import { KeystrokeCommand } from "../KeystrokeCommand";
import { notImplemented } from "../../notImplemented";

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
   * Move the NVDA cursor up to a new location.
   */
  moveUp(): Promise<void> {
    notImplemented();
  }

  /**
   * Move the NVDA cursor right to a new location.
   */
  moveRight(): Promise<void> {
    notImplemented();
  }

  /**
   * Move the NVDA cursor down to a new location.
   */
  moveDown(): Promise<void> {
    notImplemented();
  }

  /**
   * Move the NVDA cursor left to a new location.
   */
  moveLeft(): Promise<void> {
    notImplemented();
  }

  /**
   * Click the mouse once.
   */
  click(): Promise<void> {
    notImplemented();
  }

  /**
   * Double click the mouse.
   */
  doubleClick(): Promise<void> {
    notImplemented();
  }

  /**
   * Triple click the mouse.
   */
  tripleClick(): Promise<void> {
    notImplemented();
  }

  /**
   * Right click the mouse once.
   */
  rightClick(): Promise<void> {
    notImplemented();
  }

  /**
   * Double right click the mouse.
   */
  rightDoubleClick(): Promise<void> {
    notImplemented();
  }

  /**
   * Triple right click the mouse.
   */
  rightTripleClick(): Promise<void> {
    notImplemented();
  }

  /**
   * Get the last spoken phrase.
   *
   * @returns {Promise<string>} The last spoken phrase.
   */
  getLastSpokenPhrase(): Promise<string> {
    notImplemented();
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
   * Get the text of the item in the NVDA cursor.
   *
   * @returns {Promise<string>} The item's text.
   */
  getItemText(): Promise<string> {
    notImplemented();
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
