import type { ScreenReader } from "../../ScreenReader";
import type { KeyCodeCommand } from "../KeyCodeCommand";
import type { KeystrokeCommand } from "../KeystrokeCommand";
import type { Containments } from "./Containments";
import type { Places } from "./Places";
import type { CommandOptions, RetryableCommandOptions } from "../../options";
import { CommanderCommands } from "./CommanderCommands";
import { decorateStaticImplements } from "../../decorateStaticImplements";
import { isMacOS } from "../isMacOS";
import { disableSplashScreen } from "./disableSplashScreen";
import { start } from "./start";
import { waitForRunning } from "./waitForRunning";
import { Directions } from "./Directions";
import { ClickCount } from "./ClickCount";
import { ClickButton } from "./ClickButton";
import { Applications } from "../Applications";
import { quit } from "../quit";
import { sendKeys } from "../sendKeys";
import { move } from "./move";
import { click } from "./click";
import { getLastSpokenPhrase } from "./getLastSpokenPhrase";
import { copyLastSpokenPhrase } from "./copyLastSpokenPhrase";
import { saveLastSpokenPhrase } from "./saveLastSpokenPhrase";
import { takeScreenshot } from "./takeScreenshot";
import { getItemText } from "./getItemText";
import { performCommand } from "./performCommand";
import { performAction } from "./performAction";
import { supportsAppleScriptControl } from "./supportsAppleScriptControl";
import { ERR_VOICE_OVER_NOT_SUPPORTED } from "../errors";

/**
 * Class for controlling the VoiceOver ScreenReader on MacOS.
 */
@decorateStaticImplements<ScreenReader>()
export class VoiceOverBase {
  #log = false;
  #spokenPhraseLog = [];
  #itemTextLog = [];

  async #tap<T, S extends Promise<T>>(promise: S): Promise<T> {
    const result = await promise;

    if (this.#log) {
      this.#spokenPhraseLog.push(await this.getLastSpokenPhrase());
      this.#itemTextLog.push(await this.getItemText());
    }

    return result;
  }

  /**
   * Detect whether VoiceOver is supported for the current OS.
   *
   * @returns {Promise<boolean>}
   */
  static async detect(): Promise<boolean> {
    return (await isMacOS()) && (await supportsAppleScriptControl());
  }

  /**
   * Detect whether VoiceOver is the default screen reader for the current OS.
   *
   * @returns {boolean}
   */
  static async default(): Promise<boolean> {
    return await isMacOS();
  }

  /**
   * Turn VoiceOver on.
   *
   * @param {object} [options] Additional options.
   */
  async start(options?: CommandOptions): Promise<void> {
    if (!(await VoiceOverBase.detect())) {
      throw new Error(ERR_VOICE_OVER_NOT_SUPPORTED);
    }

    await disableSplashScreen();
    await start();
    await waitForRunning(options);
  }

  /**
   * Turn VoiceOver off.
   *
   * @param {object} [options] Additional options.
   */
  async stop(options?: CommandOptions): Promise<void> {
    return await quit(Applications.VOICE_OVER, options);
  }

  /**
   * Send a key code or keystroke to VoiceOver.
   *
   * @param {object} keyCommand Key code or keystroke command to send to VoiceOver.
   * @param {object} [options] Additional options.
   */
  async sendKeys(
    keyCommand: KeyCodeCommand | KeystrokeCommand,
    options?: CommandOptions
  ): Promise<void> {
    return await this.#tap(
      sendKeys(Applications.VOICE_OVER, keyCommand, options)
    );
  }

  /**
   * Move the VO cursor to a new location.
   *
   * @param {string} direction The direction to move in.
   * @param {string} [place] The place to move to.
   * @param {object} [options] Additional options.
   */
  async move(
    direction: Directions | Containments,
    place?: Places,
    options?: CommandOptions
  ): Promise<void> {
    return await this.#tap(move(direction, place, options));
  }

  /**
   * Move the VoiceOver cursor to the previous location.
   *
   * @param {object} [options] Additional options.
   */
  async movePrevious(options?: CommandOptions): Promise<void> {
    return await this.move(Directions.LEFT, undefined, options);
  }

  /**
   * Move the VoiceOver cursor to the next location.
   *
   * @param {object} [options] Additional options.
   */
  async moveNext(options?: CommandOptions): Promise<void> {
    return await this.move(Directions.RIGHT, undefined, options);
  }

  /**
   * Perform default action.
   *
   * @param {object} [options] Additional options.
   */
  async performAction(options?: CommandOptions): Promise<void> {
    return await this.#tap(performAction(options));
  }

  /**
   * Perform a VoiceOver command.
   *
   * @param {string} command The English name of the VoiceOver command to perform.
   * @param {object} [options] Additional options.
   */
  async performCommand(
    command: CommanderCommands,
    options?: CommandOptions
  ): Promise<void> {
    return await this.#tap(performCommand(command, options));
  }

  /**
   * Click the mouse once.
   *
   * @param {object} [options] Additional options.
   */
  async click(options?: CommandOptions): Promise<void> {
    return await this.#tap(
      click(ClickCount.ONCE, ClickButton.LEFT_BUTTON, options)
    );
  }

  /**
   * Double click the mouse.
   *
   * @param {object} [options] Additional options.
   */
  async doubleClick(options?: CommandOptions): Promise<void> {
    return await this.#tap(
      click(ClickCount.TWICE, ClickButton.LEFT_BUTTON, options)
    );
  }

  /**
   * Triple click the mouse.
   *
   * @param {object} [options] Additional options.
   */
  async tripleClick(options?: CommandOptions): Promise<void> {
    return await this.#tap(
      click(ClickCount.THRICE, ClickButton.LEFT_BUTTON, options)
    );
  }

  /**
   * Right click the mouse once.
   *
   * @param {object} [options] Additional options.
   */
  async rightClick(options?: CommandOptions): Promise<void> {
    return await this.#tap(
      click(ClickCount.ONCE, ClickButton.RIGHT_BUTTON, options)
    );
  }

  /**
   * Double right click the mouse.
   *
   * @param {object} [options] Additional options.
   */
  async rightDoubleClick(options?: CommandOptions): Promise<void> {
    return await this.#tap(
      click(ClickCount.TWICE, ClickButton.RIGHT_BUTTON, options)
    );
  }

  /**
   * Triple right click the mouse.
   *
   * @param {object} [options] Additional options.
   */
  async rightTripleClick(options?: CommandOptions): Promise<void> {
    return await this.#tap(
      click(ClickCount.THRICE, ClickButton.RIGHT_BUTTON, options)
    );
  }

  /**
   * Takes a screenshot of the VO cursor and returns the path to the file.
   *
   * @param {object} [options] Additional options.
   *
   * @returns {Promise<string>} The path to the screenshot.
   */
  async takeScreenshot(options?: RetryableCommandOptions): Promise<string> {
    return await takeScreenshot(options);
  }

  /**
   * Get the last spoken phrase.
   *
   * @param {object} [options] Additional options.
   *
   * @returns {Promise<string>} The last spoken phrase.
   */
  async getLastSpokenPhrase(
    options?: RetryableCommandOptions
  ): Promise<string> {
    return await getLastSpokenPhrase(options);
  }

  /**
   * Copy the last spoken phrase to the Clipboard (also called the
   * "Pasteboard").
   *
   * @param {object} [options] Additional options.
   */
  async copyLastSpokenPhrase(options?: RetryableCommandOptions): Promise<void> {
    return await copyLastSpokenPhrase(options);
  }

  /**
   * Save the last spoken phrase and the crash log to a file on the desktop for
   * troubleshooting.
   *
   * @param {object} [options] Additional options.
   */
  async saveLastSpokenPhrase(options?: RetryableCommandOptions): Promise<void> {
    return await saveLastSpokenPhrase(options);
  }

  /**
   * Get the log of all spoken phrases for this VoiceOver instance.
   *
   * Note `vo.startLog()` must first be called for spoken phrases to be logged.
   *
   * @returns {Promise<string[]>} The phrase log.
   */
  async getSpokenPhraseLog(): Promise<string[]> {
    return this.#spokenPhraseLog;
  }

  /**
   * Get the text of the item in the VoiceOver cursor.
   *
   * @param {object} [options] Additional options.
   *
   * @returns {Promise<string>} The item's text.
   */
  async getItemText(options?: RetryableCommandOptions): Promise<string> {
    return await getItemText(options);
  }

  /**
   * Get the log of all visited item text for this VoiceOver instance.
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
