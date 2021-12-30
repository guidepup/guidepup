import type { ScreenReader } from "../../ScreenReader";
import type { KeyCodeCommand } from "../KeyCodeCommand";
import type { KeystrokeCommand } from "../KeystrokeCommand";
import type { Containments } from "./Containments";
import type { Places } from "./Places";
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
import { activate } from "../activate";
import { quit } from "../quit";
import { keyCode } from "../keyCode";
import { keystroke } from "../keystroke";
import { move } from "./move";
import { click } from "./click";
import { getLastSpokenPhrase } from "./getLastSpokenPhrase";
import { copyLastSpokenPhrase } from "./copyLastSpokenPhrase";
import { saveLastSpokenPhrase } from "./saveLastSpokenPhrase";
import { takeScreenshot } from "./takeScreenshot";
import { getItemText } from "./getItemText";
import { performCommand } from "./performCommand";
import { performAction } from "./performAction";

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

  static ERR_VOICE_OVER_NOT_SUPPORTED = "VoiceOver not supported";

  /**
   * Detect whether VoiceOver is supported for the current OS.
   *
   * @returns {boolean}
   */
  static detect(): boolean {
    return isMacOS();
  }

  /**
   * Detect whether VoiceOver is the default screen reader for the current OS.
   *
   * @returns {boolean}
   */
  static default(): boolean {
    return isMacOS();
  }

  /**
   * Turn VoiceOver on.
   */
  async start(): Promise<void> {
    if (!VoiceOverBase.detect()) {
      throw new Error(VoiceOverBase.ERR_VOICE_OVER_NOT_SUPPORTED);
    }

    await disableSplashScreen();
    await start();
    await activate(Applications.VOICE_OVER);
    await waitForRunning();
  }

  /**
   * Turn VoiceOver off.
   */
  async stop(): Promise<void> {
    return await quit(Applications.VOICE_OVER);
  }

  /**
   * Send a key code to VoiceOver.
   *
   * @param {object} keyCodeCommand Key code command to send to VoiceOver.
   */
  async keyCode(keyCodeCommand: KeyCodeCommand): Promise<void> {
    return await this.#tap(keyCode(Applications.VOICE_OVER, keyCodeCommand));
  }

  /**
   * Send a keystroke to VoiceOver.
   *
   * @param {object} keystrokeCommand Keystroke command to send to VoiceOver.
   */
  async keystroke(keystrokeCommand: KeystrokeCommand): Promise<void> {
    return await this.#tap(
      keystroke(Applications.VOICE_OVER, keystrokeCommand)
    );
  }

  /**
   * Activate an application.
   *
   * This will focus the application if already running, or start and focus it
   * if not already running.
   *
   * @param {string} applicationName Path or alias for MacOS application.
   */
  async activate(applicationName: Applications | string): Promise<void> {
    return await activate(applicationName);
  }

  /**
   * Move the VO cursor to a new location.
   *
   * @param {string} direction The direction to move in.
   * @param {string} place The place to move to.
   */
  async move(
    direction: Directions | Containments,
    place?: Places
  ): Promise<void> {
    return await this.#tap(move(direction, place));
  }

  /**
   * Move the VO cursor up to a new location.
   */
  async moveUp(): Promise<void> {
    return await this.move(Directions.UP);
  }

  /**
   * Move the VO cursor right to a new location.
   */
  async moveRight(): Promise<void> {
    return await this.move(Directions.RIGHT);
  }

  /**
   * Move the VO cursor down to a new location.
   */
  async moveDown(): Promise<void> {
    return await this.move(Directions.DOWN);
  }

  /**
   * Move the VO cursor left to a new location.
   */
  async moveLeft(): Promise<void> {
    return await this.move(Directions.LEFT);
  }

  /**
   * Click the mouse once.
   */
  async click(): Promise<void> {
    return await this.#tap(click(ClickCount.ONCE));
  }

  /**
   * Double click the mouse.
   */
  async doubleClick(): Promise<void> {
    return await this.#tap(click(ClickCount.TWICE));
  }

  /**
   * Triple click the mouse.
   */
  async tripleClick(): Promise<void> {
    return await this.#tap(click(ClickCount.THRICE));
  }

  /**
   * Right click the mouse once.
   */
  async rightClick(): Promise<void> {
    return await this.#tap(click(ClickCount.ONCE, ClickButton.RIGHT_BUTTON));
  }

  /**
   * Double right click the mouse.
   */
  async rightDoubleClick(): Promise<void> {
    return await this.#tap(click(ClickCount.TWICE, ClickButton.RIGHT_BUTTON));
  }

  /**
   * Triple right click the mouse.
   */
  async rightTripleClick(): Promise<void> {
    return await this.#tap(click(ClickCount.THRICE, ClickButton.RIGHT_BUTTON));
  }

  /**
   * Takes a screenshot of the VO cursor and returns the path to the file.
   *
   * @returns {Promise<string>} The path to the screenshot
   */
  async takeScreenshot(): Promise<string> {
    return await takeScreenshot();
  }

  /**
   * Get the text of the item in the VoiceOver cursor.
   *
   * @returns {Promise<string>} The item's text.
   */
  async getItemText(): Promise<string> {
    return await getItemText();
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
   * Get the last spoken phrase.
   *
   * @returns {Promise<string>} The last spoken phrase.
   */
  async getLastSpokenPhrase(): Promise<string> {
    return await getLastSpokenPhrase();
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

  /**
   * Copy the last spoken phrase to the Clipboard (also called the
   * "Pasteboard").
   */
  async copyLastSpokenPhrase(): Promise<void> {
    return await copyLastSpokenPhrase();
  }

  /**
   * Save the last spoken phrase and the crash log to a file on the desktop for
   * troubleshooting.
   */
  async saveLastSpokenPhrase(): Promise<void> {
    return await saveLastSpokenPhrase();
  }

  /**
   * Perform a VoiceOver command.
   *
   * @param {string} command The English name of the VoiceOver command to perform.
   */
  async performCommand(command: CommanderCommands): Promise<void> {
    return await this.#tap(performCommand(command));
  }

  /**
   * Perform VoiceOver action.
   */
  async performAction(): Promise<void> {
    return await this.#tap(performAction());
  }
}
