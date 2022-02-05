import { Applications } from "../Applications";
import { ClickOptions } from "../../ClickOptions";
import { CommanderCommands } from "./CommanderCommands";
import type { CommandOptions } from "../../CommandOptions";
import { decorateStaticImplements } from "../../decorateStaticImplements";
import { disableSplashScreen } from "./disableSplashScreen";
import { ERR_VOICE_OVER_NOT_SUPPORTED } from "../errors";
import { isKeyboard } from "../../isKeyboard";
import { isMacOS } from "../isMacOS";
import { KeyboardCommand } from "../KeyboardCommand";
import { KeyboardOptions } from "../../KeyboardOptions";
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

  /**
   * Move the VoiceOver cursor to the previous location.
   *
   * Equivalent of executing VO-Left Arrow.
   *
   * @param {object} [options] Additional options.
   */
  async previous(options?: CommandOptions): Promise<void> {
    return await this.cursor.previous(options);
  }

  /**
   * Move the VoiceOver cursor to the next location.
   *
   * Equivalent of executing VO-Right Arrow.
   *
   * @param {object} [options] Additional options.
   */
  async next(options?: CommandOptions): Promise<void> {
    return await this.cursor.next(options);
  }

  /**
   * Perform the default action for the item in the VoiceOver cursor.
   *
   * Equivalent of executing VO-Space bar.
   *
   * @param {object} [options] Additional options.
   */
  async act(options?: CommandOptions): Promise<void> {
    return await this.cursor.act(options);
  }

  /**
   * Interact with the item under the ScreenReader cursor.
   *
   * Equivalent of executing VO-Shift-Down Arrow.
   *
   * @param {object} [options] Additional options.
   */
  async interact(options?: CommandOptions): Promise<void> {
    return await this.cursor.interact(options);
  }

  /**
   * Stop interacting with the current item.
   *
   * Equivalent of executing VO-Shift-Up Arrow.
   *
   * @param {object} [options] Additional options.
   */
  async stopInteracting(options?: CommandOptions): Promise<void> {
    return await this.cursor.stopInteracting(options);
  }

  /**
   * Press a key on the focused item.
   *
   * `key` can specify the intended [keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
   * value or a single character to generate the text for. A superset of the `key` values can be found
   * [on the MDN key values page](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values). Examples of the keys are:
   *
   * `F1` - `F20`, `Digit0` - `Digit9`, `KeyA` - `KeyZ`, `Backquote`, `Minus`, `Equal`, `Backslash`, `Backspace`, `Tab`,
   * `Delete`, `Escape`, `ArrowDown`, `End`, `Enter`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowRight`, `ArrowUp`, etc.
   *
   * Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`, `Meta`, `Command`.
   *
   * Holding down `Shift` will type the text that corresponds to the `key` in the upper case.
   *
   * If `key` is a single character, it is case-sensitive, so the values `a` and `A` will generate different respective
   * texts.
   *
   * Shortcuts such as `key: "Control+f"` or `key: "Control+Shift+f"` are supported as well. When specified with the
   * modifier, modifier is pressed and being held while the subsequent key is being pressed.
   *
   * ```ts
   * await keyboard.press("Control+f");
   * ```
   *
   * @param {string} key Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.
   * @param {object} [options] Additional options.
   */
  async press(key: string, options?: KeyboardOptions): Promise<void> {
    return await this.keyboard.press(key, options);
  }

  /**
   * Type text into the focused item.
   *
   * To press a special key, like `Control` or `ArrowDown`, use `keyboard.press(key[, options])`.
   *
   * ```ts
   * await keyboard.type("my-username");
   * await keyboard.press("Enter");
   * ```
   *
   * @param {string} text Text to type into the focused element.
   * @param {object} [options] Additional options.
   */
  async type(text: string, options?: KeyboardOptions): Promise<void> {
    return await this.keyboard.type(text, options);
  }

  /**
   * Perform a VoiceOver command.
   *
   * @param {any} command VoiceOver keyboard command or commander command to execute.
   * @param {object} [options] Additional options.
   */
  async perform(
    command: KeyboardCommand | CommanderCommands,
    options?: CommandOptions
  ): Promise<void> {
    if (isKeyboard(command)) {
      return await this.keyboard.perform(command, options);
    }

    return this.commander.perform(command, options);
  }

  /**
   * Click the mouse.
   *
   * @param {object} [options] Click options.
   */
  async click(options?: ClickOptions): Promise<void> {
    return await this.mouse.click(options);
  }

  /**
   * Get the last spoken phrase.
   *
   * @param {object} [options] Additional options.
   * @returns {Promise<string>} The last spoken phrase.
   */
  async lastSpokenPhrase(options?: CommandOptions): Promise<string> {
    return await this.caption.lastSpokenPhrase(options);
  }

  /**
   * Get the text of the item in the VoiceOver cursor.
   *
   * @param {object} [options] Additional options.
   * @returns {Promise<string>} The item's text.
   */
  async itemText(options?: CommandOptions): Promise<string> {
    return await this.caption.itemText(options);
  }

  /**
   * Get the log of all spoken phrases for this VoiceOver instance.
   *
   * @returns {string[]} The spoken phrase log.
   */
  spokenPhraseLog(): string[] {
    return this.caption.spokenPhraseLog();
  }

  /**
   * Get the log of all visited item text for this VoiceOver instance.
   *
   * @returns {string[]} The item text log.
   */
  itemTextLog(): string[] {
    return this.caption.itemTextLog();
  }
}
