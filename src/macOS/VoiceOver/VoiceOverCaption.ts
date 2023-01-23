import { cleanSpokenPhrase } from "./cleanSpokenPhrase";
import type { CommandOptions } from "../../CommandOptions";
import { copyLastSpokenPhrase } from "./copyLastSpokenPhrase";
import { itemText } from "./itemText";
import { lastSpokenPhrase } from "./lastSpokenPhrase";
import { LogStore } from "./LogStore";
import { saveLastSpokenPhrase } from "./saveLastSpokenPhrase";
import type { ScreenReaderCaption } from "../../ScreenReaderCaption";

export class VoiceOverCaption implements ScreenReaderCaption {
  /**
   * @ignore
   */
  #logStore: LogStore;

  constructor(logStore: LogStore) {
    this.#logStore = logStore;
  }

  /**
   * Get the last spoken phrase.
   *
   * @param {object} [options] Additional options.
   * @returns {Promise<string>} The last spoken phrase.
   */
  async lastSpokenPhrase(options?: CommandOptions): Promise<string> {
    return cleanSpokenPhrase(await lastSpokenPhrase(options));
  }

  /**
   * Copy the last spoken phrase to the Clipboard (also called the
   * "Pasteboard").
   *
   * Command specific to the VoiceOver ScreenReader.
   *
   * @param {object} [options] Additional options.
   */
  async copyLastSpokenPhrase(options?: CommandOptions): Promise<void> {
    return await copyLastSpokenPhrase(options);
  }

  /**
   * Save the last spoken phrase and the crash log to a file on the desktop for
   * troubleshooting.
   *
   * Command specific to the VoiceOver ScreenReader.
   *
   * @param {object} [options] Additional options.
   */
  async saveLastSpokenPhrase(options?: CommandOptions): Promise<void> {
    return await saveLastSpokenPhrase(options);
  }

  /**
   * Get the text of the item in the VoiceOver cursor.
   *
   * @param {object} [options] Additional options.
   * @returns {Promise<string>} The item's text.
   */
  async itemText(options?: CommandOptions): Promise<string> {
    return cleanSpokenPhrase(await itemText(options));
  }

  /**
   * Get the log of all spoken phrases for this VoiceOver instance.
   *
   * @returns {string[]} The spoken phrase log.
   */
  spokenPhraseLog(): string[] {
    return this.#logStore.spokenPhraseLog;
  }

  /**
   * Get the log of all visited item text for this VoiceOver instance.
   *
   * @returns {string[]} The item text log.
   */
  itemTextLog(): string[] {
    return this.#logStore.itemTextLog
  }
}
