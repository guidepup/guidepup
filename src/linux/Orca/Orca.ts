import { addTeardownHandler, removeTeardownHandler } from "../../teardown";
import {
  ERR_ORCA_ALREADY_RUNNING,
  ERR_ORCA_CANNOT_BE_STARTED,
  ERR_ORCA_NOT_INSTALLED,
  ERR_ORCA_NOT_RUNNING,
  ERR_ORCA_NOT_SUPPORTED,
} from "../errors";
import {
  getSetting,
  getSettings,
  loadGuidepupSettings,
  resetGuidepupSettings,
  setSettings,
} from "./settings";
import { type KeyCodeCommand, keyCodeCommands } from "./keyCodeCommands";
import type { Capture } from "../../Capture";
import type { ClickOptions } from "../../ClickOptions";
import type { CommandOptions } from "../../CommandOptions";
import type { IScreenReader } from "../../IScreenReader";
import { isLinux } from "../isLinux";
import { isOrcaInstalled } from "./isOrcaInstalled";
import { KeyCodes } from "../KeyCodes";
import { Modifiers } from "../Modifiers";
import { OrcaClient } from "./OrcaClient";
import { parseKey } from "../../parseKey";
import type { Prettify } from "../../typeHelpers";
import type { StartOptions } from "../../StartOptions";

type CaptureCommandOptions = Prettify<Pick<CommandOptions, "capture">>;
type CaptureStartOptions = Prettify<Pick<StartOptions, "capture" | "settings">>;

// REF: https://man.archlinux.org/man/orca.1.en
// REF: https://gitlab.gnome.org/GNOME/orca

// eslint-disable-next-line @typescript-eslint/no-require-imports
const manifest = require("../../../manifest.json");

/**
 * AT-SPI `KeySynthType` values used to generate real keyboard input.
 */
const KeySynthType = {
  SYM: 3,
  STRING: 4,
  LOCKMODIFIERS: 5,
  UNLOCKMODIFIERS: 6,
} as const;

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
      resetGuidepupSettings();
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
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-name)
   *
   * The screen reader name.
   */
  get name(): string {
    return "Orca";
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-version)
   *
   * The screen reader version.
   */
  get version(): string {
    return manifest.screenReaders.find(({ id }) => id === "orca").assets[0]
      .version;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-keyboard-commands)
   *
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
   *   await orca.perform(orca.keyboardCommands.MoveToNextSibling);
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   */
  get keyboardCommands(): Prettify<typeof keyCodeCommands> {
    return keyCodeCommands;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-detect)
   *
   * Detect whether Orca is supported for the current OS:
   *
   * - `false` for Windows
   * - `false` for macOS
   * - `true` for Linux
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
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-detect)
   *
   * Detect whether Orca is supported for the current OS:
   *
   * - `false` for Windows
   * - `false` for macOS
   * - `true` for Linux
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
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-default)
   *
   * Detect whether Orca is the default screen reader for the current OS:
   *
   * - `false` for Windows
   * - `false` for macOS
   * - `true` for Linux
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
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-default)
   *
   * Detect whether Orca is the default screen reader for the current OS:
   *
   * - `false` for Windows
   * - `false` for macOS
   * - `true` for Linux
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
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-start)
   *
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
  async start(options?: CaptureStartOptions): Promise<void> {
    if (!this.detect()) {
      throw new Error(ERR_ORCA_NOT_SUPPORTED);
    }

    if (!isOrcaInstalled()) {
      throw new Error(ERR_ORCA_NOT_INSTALLED);
    }

    if (this.#started || this.#starting) {
      throw new Error(ERR_ORCA_ALREADY_RUNNING);
    }

    this.#starting = true;

    addTeardownHandler(this.#teardownHandler);

    try {
      loadGuidepupSettings();

      if (options?.settings) {
        setSettings(options.settings);
      }

      this.#client = new OrcaClient();
      await this.#client.start(options);

      this.#started = true;
    } catch (cause) {
      throw new Error(ERR_ORCA_CANNOT_BE_STARTED, { cause });
    } finally {
      if (!this.#started) {
        await this.#teardownHandler();
      }

      this.#starting = false;
    }
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-stop)
   *
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
    if (!this.#started) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    this.#stopping = true;

    try {
      await this.#client?.stop();

      this.#client = null;

      resetGuidepupSettings();
      removeTeardownHandler(this.#teardownHandler);

      this.#started = false;
    } finally {
      this.#stopping = false;
    }
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-previous)
   *
   * Move the Orca cursor to the previous location.
   *
   * Equivalent of executing `Orca-Ctrl-Left Arrow`.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move to the previous location.
   *   await orca.previous();
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   */
  async previous(options?: CaptureCommandOptions): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.ObjectNavigator.commands.MoveToPreviousSibling.execute();
    }, options);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-next)
   *
   * Move the Orca cursor to the next location.
   *
   * Equivalent of executing `Orca-Ctrl-Right Arrow`.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move to the next location.
   *   await orca.next();
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   */
  async next(options?: CaptureCommandOptions): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.ObjectNavigator.commands.MoveToNextSibling.execute();
    }, options);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-previous-heading)
   *
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
  async previousHeading(options?: CaptureCommandOptions): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.StructuralNavigator.commands.PreviousHeading.execute();
    }, options);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-next-heading)
   *
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
  async nextHeading(options?: CaptureCommandOptions): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.StructuralNavigator.commands.NextHeading.execute();
    }, options);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-previous-link)
   *
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
  async previousLink(options?: CaptureCommandOptions): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.StructuralNavigator.commands.PreviousLink.execute();
    }, options);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-next-link)
   *
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
  async nextLink(options?: CaptureCommandOptions): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.StructuralNavigator.commands.NextLink.execute();
    }, options);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-previous-landmark)
   *
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
  async previousLandmark(options?: CaptureCommandOptions): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.StructuralNavigator.commands.PreviousLandmark.execute();
    }, options);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-next-landmark)
   *
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
  async nextLandmark(options?: CaptureCommandOptions): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.StructuralNavigator.commands.NextLandmark.execute();
    }, options);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-act)
   *
   * Perform the default action for the item in the Orca cursor.
   *
   * Equivalent of executing `Orca-Ctrl-Return`.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move to the next location.
   *   await orca.next();
   *
   *   // Perform the default action for the item in the Orca cursor.
   *   await orca.act();
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   */
  async act(options?: CaptureCommandOptions): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.ObjectNavigator.commands.PerformAction.execute();
    }, options);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-interact)
   *
   * Interact with the item under the Orca cursor.
   *
   * Equivalent of executing `Orca-Ctrl-Down Arrow`.
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
   *   // Interact with the item.
   *   await orca.interact();
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @param {object} [options] Additional options.
   */
  async interact(options?: CaptureCommandOptions): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.ObjectNavigator.commands.MoveToFirstChild.execute();
    }, options);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-stop-interacting)
   *
   * Stop interacting with the current item under the Orca cursor.
   *
   * Equivalent of executing `Orca-Ctrl-Up Arrow`.
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
   *   // Stop interacting with the item.
   *   await orca.stopInteracting();
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @param {object} [options] Additional options.
   */
  async stopInteracting(options?: CaptureCommandOptions): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.ObjectNavigator.commands.MoveToParent.execute();
    }, options);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-press)
   *
   * Press a key on the focused item, as real keyboard input that Orca hears
   * like a person's keyboard.
   *
   * `key` can specify the intended [keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
   * value or a single character to generate the text for. A superset of the `key` values can be found
   * [on the MDN key values page](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values). Examples of the keys are:
   *
   * `F1` - `F12`, `Digit0` - `Digit9`, `KeyA` - `KeyZ`, `Backquote`, `Minus`, `Equal`, `Backslash`, `Backspace`, `Tab`,
   * `Delete`, `Escape`, `ArrowDown`, `End`, `Enter`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowRight`, `ArrowUp`, etc.
   *
   * Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`, `Meta`.
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
   *   // Move to the next focusable item.
   *   await orca.press("Tab");
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @param {string} key Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.
   * @param {object} [options] Additional options.
   */
  async press(key: string, options?: CaptureCommandOptions): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    const { keyCode, modifiers } = parseKey<{
      keyCode: number[];
      modifiers: number[];
    }>(key, Modifiers, KeyCodes);

    const modifierMask = modifiers.reduce(
      (mask, modifier) => mask | modifier,
      0,
    );

    await this.#client.enqueueAndTap(async () => {
      if (modifierMask) {
        await this.#client.generateKeyboardEvent(
          modifierMask,
          "",
          KeySynthType.LOCKMODIFIERS,
        );
      }

      try {
        for (const keysym of keyCode) {
          await this.#client.generateKeyboardEvent(
            keysym,
            "",
            KeySynthType.SYM,
          );
        }
      } finally {
        if (modifierMask) {
          await this.#client.generateKeyboardEvent(
            modifierMask,
            "",
            KeySynthType.UNLOCKMODIFIERS,
          );
        }
      }
    }, options);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-type)
   *
   * Type text into the focused item, as real keyboard input that Orca hears
   * like a person's keyboard.
   *
   * To press a special key, like `Control` or `ArrowDown`, use `press(key[, options])`.
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
   * @param {string} text Text to type into the focused item.
   * @param {object} [options] Additional options.
   */
  async type(text: string, options?: CaptureCommandOptions): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.generateKeyboardEvent(0, text, KeySynthType.STRING);
    }, options);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-perform)
   *
   * Perform an Orca command.
   *
   * The command can be any `OrcaKeyCodeCommand`.
   *
   * ```ts
   * import { orca, orcaKeyCodeCommands } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Keyboard commands available on the Orca instance.
   *   await orca.perform(orca.keyboardCommands.MoveToNextSibling);
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @param {any} command Orca keyboard command to execute.
   */
  async perform(
    command: KeyCodeCommand,
    options?: CaptureCommandOptions,
  ): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      if (command.service === "MousePresenter") {
        const service = this.#client.service.MousePresenter;

        if (!service) {
          throw new Error(
            `Orca command module '${command.service}' is not available.`,
          );
        }

        await service.commands[command.command].execute();

        return;
      }

      await this.#client.service[command.service].commands[
        command.command
      ].execute();
    }, options);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-click)
   *
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
  async click(options?: ClickOptions): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    const command =
      options?.button === "right"
        ? this.#client.service.FlatReviewPresenter.commands.RightClickOnObject
        : this.#client.service.FlatReviewPresenter.commands.LeftClickOnObject;

    const clickCount = options?.clickCount ?? 1;

    await this.#client.enqueueAndTap(async () => {
      for (let i = 0; i < clickCount; i++) {
        await command.execute();
      }
    }, options);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-last-spoken-phrase)
   *
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

    return (await this.#client.spokenPhraseLog()).at(-1) ?? "";
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-item-text)
   *
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

    return this.lastSpokenPhrase();
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-spoken-phrase-log)
   *
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

    return this.#client.spokenPhraseLog();
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-clear-spoken-phrase-log)
   *
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

    await this.#client.clearSpokenPhraseLog();
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-item-text-log)
   *
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

    return this.spokenPhraseLog();
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-clear-item-text-log)
   *
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

    await this.#client.clearSpokenPhraseLog();
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-get-settings)
   *
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
    return getSettings();
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-get-setting)
   *
   * Returns the value of a setting for this Orca instance.
   *
   * ```ts
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Log the value for the '/org/gnome/orca/default/speech/enable' setting.
   *   console.log(orca.getSetting('/org/gnome/orca/default/speech/enable'));
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   *
   * @param key The setting name.
   * @returns {unknown} The setting value.
   */
  getSetting(key: string): unknown {
    return getSetting(key);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca#orca-capture)
   *
   * Capture Orca output produced by an action.
   *
   * The action can be performed using an external automation tool such as
   * Playwright. Guidepup captures the Orca output associated with
   * the action and returns it together with the action's result.
   *
   * @param {() => Promise<T>} action The action to perform while capturing Orca output.
   * @returns {Promise<Capture<T>>} The action's result and captured Orca output.
   */
  async capture<T>(
    action: () => Promise<T> | T,
    options?: CaptureCommandOptions,
  ): Promise<Capture<T>> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    return await this.#client.enqueueAndTap(async () => action(), options);
  }
}
