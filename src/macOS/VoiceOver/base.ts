import type { ScreenReader } from "../../ScreenReader";
import type { KeyCodeCommand } from "../../KeyCodeCommand";
import type { KeystrokeCommand } from "../../KeystrokeCommand";
import { Applications } from "../Applications";
import { disableSplashScreen } from "./disableSplashScreen";
import { start } from "./start";
import { waitForRunning } from "./waitForRunning";
import { activate } from "../activate";
import { quit } from "../quit";
import { keyCode } from "../keyCode";
import { keystroke } from "../keystroke";
import { move } from "./move";
import { getLastPhrase } from "./getLastPhrase";
import { copyLastPhrase } from "./copyLastPhrase";
import { saveLastPhrase } from "./saveLastPhrase";
import { Directions } from "./Directions";
import { Containments } from "./Containments";
import { Places } from "./Places";

export class VoiceOverBase implements ScreenReader {
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
   * @param {object} keyCodeCommand
   */
  async keyCode(keyCodeCommand: KeyCodeCommand): Promise<void> {
    return await keyCode(Applications.VOICE_OVER, keyCodeCommand);
  }

  /**
   * Send keystroke to VoiceOver.
   *
   * @param {object} keystrokeCommand
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
   * @param {string} direction
   * @param {string} place
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
   * Move the VO cursor down to a new location.
   */
  async moveDown(): Promise<void> {
    return await this.move(Directions.DOWN);
  }

  /**
   * Move the VO cursor right to a new location.
   */
  async moveRight(): Promise<void> {
    return await this.move(Directions.RIGHT);
  }

  /**
   * Move the VO cursor left to a new location.
   */
  async moveLeft(): Promise<void> {
    return await this.move(Directions.LEFT);
  }

  /**
   * Get the last spoken phrase.
   *
   * @returns {string}
   */
  async getLastPhrase(): Promise<string> {
    return await getLastPhrase();
  }

  /**
   * Copy the last spoken phrase to the Clipboard (also called the "Pasteboard")
   *
   * Gesture: VO-Shift-C
   */
  async copyLastPhrase(): Promise<void> {
    return await copyLastPhrase();
  }

  /**
   * Save the last spoken phrase and the crash log to a file on the desktop for troubleshooting
   *
   * Gesture: VO-Shift-Z
   */
  async saveLastPhrase(): Promise<void> {
    return await saveLastPhrase();
  }
}
