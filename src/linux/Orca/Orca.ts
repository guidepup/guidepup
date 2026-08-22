import { addTeardownHandler, removeTeardownHandler } from "../../teardown";
import {
  ERR_ORCA_ALREADY_RUNNING,
  ERR_ORCA_CANNOT_BE_STARTED,
  ERR_ORCA_NOT_RUNNING,
  ERR_ORCA_NOT_SUPPORTED,
} from "../errors";
import { base } from "../../debug";
import type { Capture } from "../../Capture";
import type { IScreenReader } from "../../IScreenReader";
import { isLinux } from "../isLinux";
import { notImplemented } from "../../notImplemented";
import { OrcaClient } from "./OrcaClient";
import type { Prettify } from "../../typeHelpers";
import { StartOptions } from "../../StartOptions";

const debug = base.extend("Orca");

// REF: https://man.archlinux.org/man/orca.1.en
// REF: https://gitlab.gnome.org/GNOME/orca

// eslint-disable-next-line @typescript-eslint/no-require-imports
const manifest = require("../../../manifest.json");

/**
 * Class for controlling the Orca screen reader on Linux.
 */
export class Orca implements IScreenReader {
  /**
   * Orca client.
   */
  #client: OrcaClient;

  /**
   * Orca running status.
   */
  #started = false;

  /**
   * Orca startup status.
   */
  #starting = false;

  /**
   * Orca stopping status.
   */
  #stopping = false;

  /**
   * Attempt to stop Orca and teardown config when the process is terminating.
   */
  #teardownAfterTermination = async (): Promise<void> => {
    try {
      await this.#client?.stop();
    } catch {
      // Best effort only.
    }

    this.#client = null;

    try {
      // TODO: teardown settings
    } catch {
      // Best effort only.
    }

    this.#started = false;
    this.#starting = false;
    this.#stopping = false;
  };

  /**
   * Handler for teardown should the process be interrupted, killed, etc.
   */
  #teardownHandler = async (): Promise<void> => {
    removeTeardownHandler(this.#teardownHandler);

    await this.#teardownAfterTermination();
  };

  /**
   * The screen reader name.
   */
  get name(): string {
    return "Orca";
  }

  /**
   * The screen reader version.
   */
  get version(): string {
    return manifest.screenReaders.find(({ id }) => id === "orca").assets[0]
      .version;
  }

  /**
   * Getter for all Orca keyboard commands.
   *
   * Use with the Orca `perform` command to invoke a keyboard action:
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move to the next item.
   *   await orca.perform(orca.keyboardCommands.moveToNext);
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   */
  get keyboardCommands(): Prettify<unknown> {
    return notImplemented();
  }

  /**
   * Detect whether Orca is supported for the current OS:
   *
   * - `true` for Windows
   * - `false` for MacOS
   * - `false` for Linux
   *
   * ```ts
   * import { Orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   const isOrcaDefaultScreenReader = Orca.detect();
   *
   *   console.log(isOrcaDefaultScreenReader);
   * })();
   * ```
   *
   * @returns {boolean}
   */
  static detect(): boolean {
    return isLinux();
  }

  /**
   * Detect whether Orca is supported for the current OS:
   *
   * - `true` for Windows
   * - `false` for MacOS
   * - `false` for Linux
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   const isOrcaDefaultScreenReader = orca.detect();
   *
   *   console.log(isOrcaDefaultScreenReader);
   * })();
   * ```
   *
   * @returns {boolean}
   */
  detect(): boolean {
    return Orca.detect();
  }

  /**
   * Detect whether Orca is the default screen reader for the current OS:
   *
   * - `true` for Windows
   * - `false` for MacOS
   * - `false` for Linux
   *
   * ```ts
   * import { Orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   const isOrcaDefaultScreenReader = Orca.default();
   *
   *   console.log(isOrcaDefaultScreenReader);
   * })();
   * ```
   *
   * @returns {boolean}
   */
  static default(): boolean {
    return isLinux();
  }

  /**
   * Detect whether Orca is the default screen reader for the current OS:
   *
   * - `true` for Windows
   * - `false` for MacOS
   * - `false` for Linux
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   const isOrcaDefaultScreenReader = orca.default();
   *
   *   console.log(isOrcaDefaultScreenReader);
   * })();
   * ```
   *
   * @returns {boolean}
   */
  default(): boolean {
    return Orca.default();
  }

  /**
   * Turn Orca on.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // ... perform some commands.
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * Note: By default the `capture` option is set to `"initial"` to capture the
   * first "page" of output, but not any subsequent content. To enable full
   * capture set `{ capture: true }`, or to disable capture set
   * `{ capture: false }`.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async start(_options?: StartOptions): Promise<void> {
    if (!this.detect()) {
      throw new Error(ERR_ORCA_NOT_SUPPORTED);
    }

    if (this.#started || this.#starting) {
      throw new Error(ERR_ORCA_ALREADY_RUNNING);
    }

    this.#starting = true;

    addTeardownHandler(this.#teardownHandler);

    try {
      // TODO: settings

      this.#client = new OrcaClient();
      await this.#client.start();

      this.#started = true;
    } catch (cause) {
      throw new Error(ERR_ORCA_CANNOT_BE_STARTED, { cause });
    } finally {
      if (!this.#started) {
        try {
          await this.#client.stop();
        } catch {
          // Swallow
        }
      }

      this.#starting = false;
    }
  }

  /**
   * Turn Orca off.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // ... perform some commands.
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   */
  async stop(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    this.#stopping = true;

    try {
      await this.#client.stop();

      this.#client = null;

      // TODO: teardown settings

      removeTeardownHandler(this.#teardownHandler);
    } finally {
      this.#started = false;
      this.#stopping = false;
    }
  }

  /**
   * Move the Orca cursor to the previous location.
   *
   * Equivalent of executing `Up Arrow`.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move to the previous item.
   *   await orca.previous();
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   */
  async previous(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Move the Orca cursor to the next location.
   *
   * Equivalent of executing `Down Arrow`.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move to the next item.
   *   await orca.next();
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   */
  async next(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      const result = await this.#client.service.CaretNavigator.ExecuteCommand(
        "NextLine",
        true,
      );

      debug("result of ExecuteCommand", result);
    });
  }

  /**
   * Move the Orca cursor to the previous heading.
   *
   * Equivalent of executing `Shift-H`.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move to the previous heading.
   *   await orca.previousHeading();
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @param {object} [options] Additional options.
   */
  async previousHeading(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Move the Orca cursor to the next heading.
   *
   * Equivalent of executing `H`.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move to the next heading.
   *   await orca.nextHeading();
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @param {object} [options] Additional options.
   */
  async nextHeading(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Move the Orca cursor to the previous link.
   *
   * Equivalent of executing `Shift-K`.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move to the previous link.
   *   await orca.previousLink();
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @param {object} [options] Additional options.
   */
  async previousLink(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Move the Orca cursor to the next link.
   *
   * Equivalent of executing `K`.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move to the next link.
   *   await orca.nextLink();
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @param {object} [options] Additional options.
   */
  async nextLink(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Move the Orca cursor to the previous landmark.
   *
   * Equivalent of executing `Shift-D`.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move to the previous landmark.
   *   await orca.previousLandmark();
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @param {object} [options] Additional options.
   */
  async previousLandmark(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Move the Orca cursor to the next landmark.
   *
   * Equivalent of executing `D`.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move to the next landmark.
   *   await orca.nextLandmark();
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @param {object} [options] Additional options.
   */
  async nextLandmark(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Perform the default action for the item in the Orca cursor.
   *
   * Equivalent of executing `Enter`.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move to the next item.
   *   await orca.next();
   *
   *   // Perform the default action for the item.
   *   await orca.act();
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   */
  async act(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * No-op to provide same API across screen-readers.
   *
   * Orca does not require users to perform an additional command to interact
   * with the item in the Orca cursor.
   */
  async interact(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * No-op to provide same API across screen-readers.
   *
   * Orca does not require users to perform an additional command to interact
   * with the item in the Orca cursor.
   */
  async stopInteracting(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
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
   * See [WindowsKeyCodes](https://www.guidepup.dev/docs/api/class-windows-key-codes) for the full range of available keys.
   *
   * Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`.
   *
   * See [WindowsModifiers](https://www.guidepup.dev/docs/api/class-windows-modifiers) for the full range of available modifiers.
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
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Open a find text modal.
   *   await orca.press("Control+f");
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @param {string} key Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.
   */
  async press(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Type text into the focused item.
   *
   * To press a special key, like `Control` or `ArrowDown`, use `orca.press(key[, options])`.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Type a username and key Enter.
   *   await orca.type("my-username");
   *   await orca.press("Enter");
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * Note: Each character is typed separately for this command. This means
   * calling `await orca.lastSpokenPhrase()` will yield the last spoken phrase
   * for the last character in the typed string. If you need access to the
   * spoken phrase(s) for the entire typed string then use
   * `await orca.spokenPhraseLog()`.
   *
   * @param {string} text Text to type into the focused item.
   */
  async type(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Perform a Orca command.
   *
   * The command can be a [WindowsKeyCodeCommand](https://www.guidepup.dev/docs/api/class-windows-key-code-command) or [WindowsKeystrokeCommand](https://www.guidepup.dev/docs/api/class-windows-keystroke-command).
   *
   * ```ts
   * import { orca, OrcaKeyCodeCommands } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Type using a custom keystroke command.
   *   await orca.perform({ characters: "my-username" });
   *
   *   // Keyboard commands available on the Orca instance.
   *   await orca.perform(orca.keyboardCommands.performDefaultActionForItem);
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @param {any} command Orca keyboard command to execute.
   */
  async perform(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Click the mouse.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Left-click the mouse.
   *   await orca.click();
   *
   *   // Left-click the mouse using specific options.
   *   await orca.click({ button: "left", clickCount: 1 });
   *
   *   // Double-right-click the mouse.
   *   await orca.click({ button: "right", clickCount: 2 });
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @param {object} [options] Click options.
   */
  async click(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Get the last spoken phrase.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move to the next item.
   *   await orca.next();
   *
   *   // Get the phrase spoken by Orca from moving to the next item above.
   *   const lastSpokenPhrase = await orca.lastSpokenPhrase();
   *   console.log(lastSpokenPhrase);
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @returns {string} The last spoken phrase.
   */
  async lastSpokenPhrase(): Promise<string> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Get the last spoken phrase.
   *
   * For Orca this is the same as `lastSpokenPhrase`.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move to the next item.
   *   await orca.next();
   *
   *   // Get the text (if any) for the item currently in focus by the Orca
   *   // cursor.
   *   const itemText = await orca.itemText();
   *   console.log(itemText);
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @alias lastSpokenPhrase
   *
   * @returns {Promise<string>} The last spoken phrase.
   */
  async itemText(): Promise<string> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Get the log of all spoken phrases for this Orca instance.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move through several items.
   *   for (let i = 0; i < 10; i++) {
   *     await orca.next();
   *   }
   *
   *   // Get the phrase spoken by Orca from moving through the items above.
   *   const spokenPhraseLog = await orca.spokenPhraseLog();
   *   console.log(spokenPhraseLog);
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @returns {Promise<string[]>} The spoken phrase log.
   */
  async spokenPhraseLog(): Promise<string[]> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Clear the log of all spoken phrases for this Orca instance.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // ... perform some commands.
   *
   *   // Clear the spoken phrase log.
   *   await orca.clearSpokenPhraseLog();
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   */
  async clearSpokenPhraseLog(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Get the log of all spoken phrases for this Orca instance.
   *
   * For Orca this is the same as `spokenPhraseLog`.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move through several items.
   *   for (let i = 0; i < 10; i++) {
   *     await orca.next();
   *   }
   *
   *   // Get the text (if any) for all the items visited by the Orca cursor.
   *   const itemTextLog = await orca.itemTextLog();
   *   console.log(itemTextLog);
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @alias lastSpokenPhrase
   *
   * @returns {Promise<string[]>} The spoken phrase log.
   */
  async itemTextLog(): Promise<string[]> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Clear the log of all spoken phrases for this Orca instance.
   *
   * For Orca this is the same as `clearSpokenPhraseLog`.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // ... perform some commands.
   *
   *   // Clear the spoken phrase log.
   *   await orca.clearItemTextLog();
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @alias clearSpokenPhraseLog
   */
  async clearItemTextLog(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Returns all the current settings for this Orca instance.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Log current settings.
   *   console.log(orca.getSettings());
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @returns {Record<string, unknown>} Current settings values.
   */
  getSettings(): Record<string, unknown> {
    notImplemented();
  }

  /**
   * Returns the value of a setting for this Orca instance.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Log the value for the 'virtualBuffers.autoSayAllOnPageLoad' setting.
   *   console.log(orca.getSetting('virtualBuffers.autoSayAllOnPageLoad'));
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @param key The setting name.
   * @returns {unknown} The setting value.
   */
  getSetting(): unknown {
    notImplemented();
  }

  /**
   * Capture Orca output produced by an action.
   *
   * The action can be performed using an external automation tool such as
   * Playwright. Guidepup captures the Orca output associated with
   * the action and returns it together with the action's result.
   *
   * @param {() => Promise<T>} action The action to perform while capturing Orca output.
   * @param {object} [options] Additional options.
   * @returns {Promise<Capture<T>>} The action's result and captured Orca output.
   */
  async capture<T>(): Promise<Capture<T>> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }
}
