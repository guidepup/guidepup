import type { ScreenReader } from "../../ScreenReader";
import type { KeyCodeCommand } from "../../KeyCodeCommand";
import type { KeystrokeCommand } from "../../KeystrokeCommand";
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
import { getText } from "./getText";
import { performCommand } from "./performCommand";
import { performAction } from "./performAction";

@decorateStaticImplements<ScreenReader>()
export class VoiceOverBase {
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
   * Send keyCode to VoiceOver.
   *
   * @param {object} keyCodeCommand KeyCode command to send to VoiceOver.
   */
  async keyCode(keyCodeCommand: KeyCodeCommand): Promise<void> {
    return await keyCode(Applications.VOICE_OVER, keyCodeCommand);
  }

  /**
   * Send keystroke to VoiceOver.
   *
   * @param {object} keystrokeCommand Keystroke command to send to VoiceOver.
   */
  async keystroke(keystrokeCommand: KeystrokeCommand): Promise<void> {
    return await keystroke(Applications.VOICE_OVER, keystrokeCommand);
  }

  /**
   * Activate an application.
   *
   * This will focus the application if already running, or start and focus it
   * if not already running.
   *
   * @param {string} applicationName
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
    return await move(direction, place);
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
    return await click(ClickCount.ONCE);
  }

  /**
   * Double click the mouse.
   */
  async doubleClick(): Promise<void> {
    return await click(ClickCount.TWICE);
  }

  /**
   * Triple click the mouse.
   */
  async tripleClick(): Promise<void> {
    return await click(ClickCount.THRICE);
  }

  /**
   * Right click the mouse once.
   */
  async rightClick(): Promise<void> {
    return await click(ClickCount.ONCE, ClickButton.RIGHT_BUTTON);
  }

  /**
   * Double right click the mouse.
   */
  async rightDoubleClick(): Promise<void> {
    return await click(ClickCount.TWICE, ClickButton.RIGHT_BUTTON);
  }

  /**
   * Triple right click the mouse.
   */
  async rightTripleClick(): Promise<void> {
    return await click(ClickCount.THRICE, ClickButton.RIGHT_BUTTON);
  }

  /**
   * Takes a screenshot of the VO cursor and returns the path to the file.
   *
   * @returns {string} the path to the screenshot
   */
  async takeScreenshot(): Promise<string> {
    return await takeScreenshot();
  }

  /**
   * The text of the item in the VoiceOver cursor.
   *
   * @returns {string}
   */
  async getText(): Promise<string> {
    return await getText();
  }

  /**
   * Get the last spoken phrase.
   *
   * @returns {string} The last spoken phrase.
   */
  async getLastSpokenPhrase(): Promise<string> {
    return await getLastSpokenPhrase();
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
    return await performCommand(command);
  }

  /**
   * Perform VoiceOver action.
   */
  async performAction(): Promise<void> {
    return await performAction();
  }
}
