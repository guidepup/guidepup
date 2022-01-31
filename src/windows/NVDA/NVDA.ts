import { ERR_NVDA_NOT_SUPPORTED } from "../errors";
import { isNVDAInstalled } from "./isNVDAInstalled";
import { isWindows } from "../isWindows";
import { notImplemented } from "../../notImplemented";
import { quit } from "./quit";
import { start } from "./start";

/**
 * Class for controlling the NVDA ScreenReader on MacOS.
 */
export class NVDA {
  #spokenPhraseLog = [];
  #itemTextLog = [];

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
   * Get the last spoken phrase.
   *
   * @returns {Promise<string>} The last spoken phrase.
   */
  lastSpokenPhrase(): Promise<string> {
    // TODO: interact with NVDA (python) console to retrieve last phrase
    notImplemented();
  }

  /**
   * Get the log of all spoken phrases for this NVDA instance.
   *
   * @returns {string[]} The phrase log.
   */
  spokenPhraseLog(): string[] {
    return this.#spokenPhraseLog;
  }

  /**
   * Get the text of the item in the NVDA cursor.
   *
   * @returns {Promise<string>} The item's text.
   */
  itemText(): Promise<string> {
    // TODO: interact with NVDA (python) console to retrieve item text
    notImplemented();
  }

  /**
   * Get the log of all visited item text for this NVDA instance.
   *
   * @returns {string[]} The item text log.
   */
  itemTextLog(): string[] {
    return this.#itemTextLog;
  }
}
