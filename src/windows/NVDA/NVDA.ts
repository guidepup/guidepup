import {
  ERR_NVDA_ALREADY_RUNNING,
  ERR_NVDA_NOT_RUNNING,
  ERR_NVDA_NOT_SUPPORTED,
} from "../errors";
import type { ClickOptions } from "../../ClickOptions";
import { CommandOptions } from "../../CommandOptions";
import { isNVDAInstalled } from "./isNVDAInstalled";
import { isWindows } from "../isWindows";
import type { KeyCodeCommand } from "../KeyCodeCommand";
import { keyCodeCommands } from "./keyCodeCommands";
import { KeyCodes } from "../KeyCodes";
import { Modifiers } from "../Modifiers";
import { NVDAClient } from "./NVDAClient";
import { parseKey } from "../../parseKey";
import { quit } from "./quit";
import type { ScreenReader } from "../../ScreenReader";
import { sendKeys } from "../sendKeys";
import { start } from "./start";

/**
 * Class for controlling the NVDA screen reader on Windows.
 */
export class NVDA implements ScreenReader {
  #client: NVDAClient;
  #started = false;

  constructor() {
    this.#client = new NVDAClient();
  }

  /**
   * NVDA keyboard commands.
   */
  get keyboardCommands(): typeof keyCodeCommands {
    return keyCodeCommands;
  }

  /**
   * Detect whether NVDA is supported for the current OS.
   *
   * @returns {Promise<boolean>}
   */
  async detect(): Promise<boolean> {
    return isWindows() && (await isNVDAInstalled());
  }

  /**
   * Detect whether NVDA is the default screen reader for the current OS.
   *
   * @returns {Promise<boolean>}
   */
  async default(): Promise<boolean> {
    return await Promise.resolve(isWindows());
  }

  /**
   * Turn NVDA on.
   */
  async start(options?: Pick<CommandOptions, "capture">): Promise<void> {
    if (!(await this.detect())) {
      throw new Error(ERR_NVDA_NOT_SUPPORTED);
    }

    if (this.#started) {
      throw new Error(ERR_NVDA_ALREADY_RUNNING);
    }

    await start();
    await this.#client.connect(options);

    this.#started = true;
  }

  /**
   * Turn NVDA off.
   */
  async stop(): Promise<void> {
    if (!this.#started) {
      throw new Error(ERR_NVDA_NOT_RUNNING);
    }

    this.#client.disconnect();
    await quit();
    this.#started = false;
  }

  /**
   * Move the NVDA cursor to the previous location.
   *
   * Equivalent of executing Up Arrow.
   */
  async previous(options?: Pick<CommandOptions, "capture">): Promise<void> {
    if (!this.#started) {
      throw new Error(ERR_NVDA_NOT_RUNNING);
    }

    return await this.#client.waitForSpokenPhrase(
      () => this.#client.sendKeyCode(keyCodeCommands.moveToPrevious),
      options
    );
  }

  /**
   * Move the NVDA cursor to the next location.
   *
   * Equivalent of executing Down Arrow.
   */
  async next(options?: Pick<CommandOptions, "capture">): Promise<void> {
    if (!this.#started) {
      throw new Error(ERR_NVDA_NOT_RUNNING);
    }

    return await this.#client.waitForSpokenPhrase(
      () => this.#client.sendKeyCode(keyCodeCommands.moveToNext),
      options
    );
  }

  /**
   * Perform the default action for the item in the NVDA cursor.
   *
   * Equivalent of executing Enter.
   */
  async act(options?: Pick<CommandOptions, "capture">): Promise<void> {
    if (!this.#started) {
      throw new Error(ERR_NVDA_NOT_RUNNING);
    }

    return await this.#client.waitForSpokenPhrase(
      () => this.#client.sendKeyCode(keyCodeCommands.activate),
      options
    );
  }

  /**
   * No-op to provide same API across screen-readers.
   *
   * NVDA does not require users to perform an additional command to interact
   * with the item in the NVDA cursor.
   */
  async interact(): Promise<void> {
    if (!this.#started) {
      throw new Error(ERR_NVDA_NOT_RUNNING);
    }

    return Promise.resolve();
  }

  /**
   * No-op to provide same API across screen-readers.
   *
   * NVDA does not require users to perform an additional command to interact
   * with the item in the NVDA cursor.
   */
  async stopInteracting(): Promise<void> {
    if (!this.#started) {
      throw new Error(ERR_NVDA_NOT_RUNNING);
    }

    return await Promise.resolve();
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
   * Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`.
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
   * await nvda.press("Control+f");
   * ```
   *
   * @param {string} key Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.
   */
  async press(
    key: string,
    options?: Pick<CommandOptions, "capture">
  ): Promise<void> {
    if (!this.#started) {
      throw new Error(ERR_NVDA_NOT_RUNNING);
    }

    return await this.perform(
      parseKey<KeyCodeCommand>(key, Modifiers, KeyCodes),
      options
    );
  }

  /**
   * Type text into the focused item.
   *
   * ```ts
   * await nvda.type("my-username");
   * ```
   *
   * @param {string} text Text to type into the focused item.
   */
  async type(
    text: string,
    options?: Pick<CommandOptions, "capture">
  ): Promise<void> {
    if (!this.#started) {
      throw new Error(ERR_NVDA_NOT_RUNNING);
    }

    return await this.#client.waitForSpokenPhrase(
      () => sendKeys({ characters: text }),
      options
    );
  }

  /**
   * Perform a NVDA command.
   *
   * @param {any} command NVDA keyboard command to execute.
   */
  async perform(
    command: KeyCodeCommand,
    options?: Pick<CommandOptions, "capture">
  ): Promise<void> {
    if (!this.#started) {
      throw new Error(ERR_NVDA_NOT_RUNNING);
    }

    return await this.#client.waitForSpokenPhrase(
      () => this.#client.sendKeyCode(command),
      options
    );
  }

  /**
   * Click the mouse.
   *
   * @param {object} [options] Click options.
   */
  async click(options?: ClickOptions): Promise<void> {
    if (!this.#started) {
      throw new Error(ERR_NVDA_NOT_RUNNING);
    }

    const command =
      options.button === "right"
        ? keyCodeCommands.rightMouseClick
        : keyCodeCommands.leftMouseClick;

    await this.#client.waitForSpokenPhrase(
      () =>
        Promise.all(
          [...new Array(options.clickCount ?? 1)].map(() =>
            this.#client.sendKeyCode(command)
          )
        ),
      options
    );
  }

  /**
   * Get the last spoken phrase.
   *
   * @returns {string} The last spoken phrase.
   */
  async lastSpokenPhrase(): Promise<string> {
    if (!this.#started) {
      throw new Error(ERR_NVDA_NOT_RUNNING);
    }

    return (await this.#client.spokenPhraseLog()).at(-1) ?? "";
  }

  /**
   * Get the last spoken phrase.
   *
   * For NVDA this is the same as `lastSpokenPhrase`.
   *
   * @alias lastSpokenPhrase
   *
   * @returns {Promise<string>} The last spoken phrase.
   */
  async itemText(): Promise<string> {
    if (!this.#started) {
      throw new Error(ERR_NVDA_NOT_RUNNING);
    }

    return await this.lastSpokenPhrase();
  }

  /**
   * Get the log of all spoken phrases for this NVDA instance.
   *
   * @returns {Promise<string[]>} The spoken phrase log.
   */
  async spokenPhraseLog(): Promise<string[]> {
    if (!this.#started) {
      throw new Error(ERR_NVDA_NOT_RUNNING);
    }

    return await this.#client.spokenPhraseLog();
  }

  /**
   * Get the log of all spoken phrases for this NVDA instance.
   *
   * For NVDA this is the same as `spokenPhraseLog`.
   *
   * @alias lastSpokenPhrase
   *
   * @returns {Promise<string[]>} The spoken phrase log.
   */
  async itemTextLog(): Promise<string[]> {
    if (!this.#started) {
      throw new Error(ERR_NVDA_NOT_RUNNING);
    }

    return await this.spokenPhraseLog();
  }
}
