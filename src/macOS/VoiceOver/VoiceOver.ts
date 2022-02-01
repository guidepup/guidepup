import { Applications } from "../Applications";
import type { CommandOptions } from "../../CommandOptions";
import { decorateStaticImplements } from "../../decorateStaticImplements";
import { disableSplashScreen } from "./disableSplashScreen";
import { ERR_VOICE_OVER_NOT_SUPPORTED } from "../errors";
import { isMacOS } from "../isMacOS";
import { LogStore } from "../../LogStore";
import { quit } from "../quit";
import type { ScreenReader } from "../../ScreenReader";
import { start } from "./start";
import { supportsAppleScriptControl } from "./supportsAppleScriptControl";
import { VoiceOverCaption } from "./VoiceOverCaption";
import { VoiceOverCommander } from "./VoiceOverCommander";
import { VoiceOverCursor } from "./VoiceOverCursor";
import { VoiceOverKeyboard } from "./VoiceOverKeyboard";
import { VoiceOverMouse } from "./VoiceOverMouse";
import { waitForRunning } from "./waitForRunning";

/**
 * Class for controlling the VoiceOver ScreenReader on MacOS.
 */
@decorateStaticImplements<ScreenReader>()
export class VoiceOver {
  /**
   * VoiceOver caption APIs.
   */
  caption!: VoiceOverCaption;

  /**
   * VoiceOver commander APIs.
   */
  commander!: VoiceOverCommander;

  /**
   * VoiceOver cursor APIs.
   */
  cursor!: VoiceOverCursor;

  /**
   * VoiceOver keyboard APIs.
   */
  keyboard!: VoiceOverKeyboard;

  /**
   * VoiceOver mouse APIs.
   */
  mouse!: VoiceOverMouse;

  constructor() {
    const logStore = new LogStore(this);
    this.caption = new VoiceOverCaption(logStore);
    this.commander = new VoiceOverCommander(logStore);
    this.cursor = new VoiceOverCursor(logStore);
    this.keyboard = new VoiceOverKeyboard(logStore);
    this.mouse = new VoiceOverMouse(logStore);
  }

  /**
   * Detect whether VoiceOver is supported for the current OS.
   *
   * @returns {Promise<boolean>}
   */
  static async detect(): Promise<boolean> {
    return isMacOS() && (await supportsAppleScriptControl());
  }

  /**
   * Detect whether VoiceOver is the default screen reader for the current OS.
   *
   * @returns {Promise<boolean>}
   */
  static default(): Promise<boolean> {
    return Promise.resolve(isMacOS());
  }

  /**
   * Turn VoiceOver on.
   *
   * @param {object} [options] Additional options.
   */
  async start(options?: CommandOptions): Promise<void> {
    if (!(await VoiceOver.detect())) {
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
    return await quit(Applications.VoiceOver, options);
  }
}
