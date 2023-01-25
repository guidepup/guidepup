import type { CommandOptions } from "../../CommandOptions";
import { copyLastSpokenPhrase } from "./copyLastSpokenPhrase";
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
   * @returns {Promise<string>} The last spoken phrase.
   */
  async lastSpokenPhrase(): Promise<string> {
    return await this.#logStore.lastSpokenPhrase();
  }

  /**
   * Copy the last spoken phrase to the Clipboard (also called the
   * "Pasteboard").
   *
   * Command specific to the VoiceOver screen reader.
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
   * Command specific to the VoiceOver screen reader.
   *
   * @param {object} [options] Additional options.
   */
  async saveLastSpokenPhrase(options?: CommandOptions): Promise<void> {
    return await saveLastSpokenPhrase(options);
  }

  /**
   * Get the text of the item in the VoiceOver cursor.
   *
   * @returns {Promise<string>} The item's text.
   */
  async itemText(): Promise<string> {
    return await this.#logStore.itemText();
  }

  /**
   * Get the log of all spoken phrases for this VoiceOver instance.
   *
   * @returns {Promise<string[]>} The spoken phrase log.
   */
  async spokenPhraseLog(): Promise<string[]> {
    return await this.#logStore.spokenPhraseLog();
  }

  /**
   * Get the log of all visited item text for this VoiceOver instance.
   *
   * @returns {Promise<string[]>} The item text log.
   */
  async itemTextLog(): Promise<string[]> {
    return await this.#logStore.itemTextLog();
  }
}
