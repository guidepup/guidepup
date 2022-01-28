import type { ScreenReader } from "../../ScreenReader";
import { decorateStaticImplements } from "../../decorateStaticImplements";
import { isWindows } from "../isWindows";
import { isNVDAInstalled } from "./isNVDAInstalled";
import { start } from "./start";
import { quit } from "./quit";
import { KeyCodeCommand } from "../KeyCodeCommand";
import { KeyCodes } from "../KeyCodes";
import { sendKeys } from "../sendKeys";
import { KeystrokeCommand } from "../KeystrokeCommand";
import { notImplemented } from "../../notImplemented";
import { ERR_NVDA_NOT_SUPPORTED } from "../errors";

/**
 * Class for controlling the NVDA ScreenReader on MacOS.
 */
@decorateStaticImplements<ScreenReader>()
export class NVDA {
  #spokenPhraseLog = [];
  #itemTextLog = [];

  async #tap<T, S extends Promise<T>>(promise: S): Promise<T> {
    const result = await promise;

    // TODO: store last logs

    return result;
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
  }

  /**
   * Turn NVDA off.
   */
  async stop(): Promise<void> {
    await quit();
  }

  /**
   * Send a key code or keystroke to NVDA.
   *
   * @param {object} keyCommand Key code or keystroke command to send to NVDA.
   */
  async sendKeys(keyCommand: KeyCodeCommand | KeystrokeCommand): Promise<void> {
    this.#tap(sendKeys(keyCommand));
  }

  /**
   * Move the NVDA cursor to the previous location.
   */
  async movePrevious(): Promise<void> {
    await this.sendKeys({ keyCode: KeyCodes.KEY_UP_ARROW });
  }

  /**
   * Move the NVDA cursor to the next location.
   */
  async moveNext(): Promise<void> {
    await this.sendKeys({ keyCode: KeyCodes.KEY_DOWN_ARROW });
  }

  /**
   * Perform default action.
   */
  async performAction(): Promise<void> {
    await this.sendKeys({ keyCode: KeyCodes.KEY_ENTER });
  }

  /**
   * Get the last spoken phrase.
   *
   * @returns {Promise<string>} The last spoken phrase.
   */
  getLastSpokenPhrase(): Promise<string> {
    // TODO: interact with NVDA (python) console to retrieve last phrase
    notImplemented();
  }

  /**
   * Get the log of all spoken phrases for this NVDA instance.
   *
   * @returns {string[]} The phrase log.
   */
  getSpokenPhraseLog(): string[] {
    return this.#spokenPhraseLog;
  }

  /**
   * Get the text of the item in the NVDA cursor.
   *
   * @returns {Promise<string>} The item's text.
   */
  getItemText(): Promise<string> {
    // TODO: interact with NVDA (python) console to retrieve item text
    notImplemented();
  }

  /**
   * Get the log of all visited item text for this NVDA instance.
   *
   * @returns {string[]} The item text log.
   */
  getItemTextLog(): string[] {
    return this.#itemTextLog;
  }
}
