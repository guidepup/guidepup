import { Applications } from "../Applications";
import type { CommandOptions } from "../../CommandOptions";
import type { KeyboardCommand } from "../KeyboardCommand";
import type { KeyboardOptions } from "../../KeyboardOptions";
import type { KeyCodeCommand } from "../KeyCodeCommand";
import { keyCodeCommands } from "./keyCodeCommands";
import { KeyCodes } from "../KeyCodes";
import { LogStore } from "../../LogStore";
import { Modifiers } from "../Modifiers";
import { parseKey } from "../../parseKey";
import type { ScreenReaderKeyboard } from "../../ScreenReaderKeyboard";
import { sendKeys } from "../sendKeys";

export class VoiceOverKeyboard implements ScreenReaderKeyboard {
  /**
   * @ignore
   */
  #logStore: LogStore;

  constructor(vo: LogStore) {
    this.#logStore = vo;
  }

  /**
   * Press a key on the focused element.
   *
   * @param {string} key Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.
   * @param {object} [options] Additional options.
   */
  async press(key: string, options?: KeyboardOptions): Promise<void> {
    return await this.#logStore.tap(
      sendKeys(
        parseKey<KeyCodeCommand>(key, Modifiers, KeyCodes),
        options?.application,
        options
      )
    );
  }

  /**
   * Type into the focused item.
   *
   * To press a special key, like `Control` or `ArrowDown`, use `keyboard.press(key[, options])`.
   *
   * @param {string} text Text to type into the focused element.
   * @param {object} [options] Additional options.
   */
  async type(text: string, options?: KeyboardOptions): Promise<void> {
    return await this.#logStore.tap(
      sendKeys({ characters: text }, options?.application, options)
    );
  }

  /**
   * VoiceOver keyboard commands.
   */
  get commands(): Record<keyof typeof keyCodeCommands, KeyCodeCommand> {
    return keyCodeCommands;
  }

  /**
   * Perform a VoiceOver command.
   *
   * @param {object} command VoiceOver keyboard command to execute.
   * @param {object} [options] Additional options.
   */
  async perform(
    command: KeyboardCommand,
    options?: CommandOptions
  ): Promise<void> {
    return await this.#logStore.tap(
      sendKeys(command, Applications.VoiceOver, options)
    );
  }
}
