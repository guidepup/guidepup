import { addTeardownHandler, removeTeardownHandler } from "../../teardown";
import {
  ERR_ORCA_ALREADY_RUNNING,
  ERR_ORCA_CANNOT_BE_STARTED,
  ERR_ORCA_NOT_RUNNING,
  ERR_ORCA_NOT_SUPPORTED,
} from "../errors";
import { type KeyCodeCommand, keyCodeCommands } from "./keyCodeCommands";
import type { Capture } from "../../Capture";
import type { ClickOptions } from "../../ClickOptions";
import type { IScreenReader } from "../../IScreenReader";
import { isLinux } from "../isLinux";
import { notImplemented } from "../../notImplemented";
import { OrcaClient } from "./OrcaClient";
import type { Prettify } from "../../typeHelpers";
import type { StartOptions } from "../../StartOptions";

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
   * import { unstable_orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await unstable_orca.start();
   *
   *   // Move to the next item.
   *   await unstable_orca.perform(unstable_orca.keyboardCommands.MoveToNextSibling);
   *
   *   // Stop Orca.
   *   await unstable_orca.stop();
   * })();
   * ```
   */
  get keyboardCommands(): Prettify<typeof keyCodeCommands> {
    return keyCodeCommands;
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
   * import { unstable_orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   const isOrcaDefaultScreenReader = unstable_orca.detect();
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
   * import { unstable_orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   const isOrcaDefaultScreenReader = unstable_orca.default();
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
   * import { unstable_orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await unstable_orca.start();
   *
   *   // ... perform some commands.
   *
   *   // Stop Orca.
   *   await unstable_orca.stop();
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
      // TODO: configure settings

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
   * import { unstable_orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await unstable_orca.start();
   *
   *   // ... perform some commands.
   *
   *   // Stop Orca.
   *   await unstable_orca.stop();
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
   * import { unstable_orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await unstable_orca.start();
   *
   *   // Move to the previous item.
   *   await unstable_orca.previous();
   *
   *   // Stop Orca.
   *   await unstable_orca.stop();
   * })();
   * ```
   */
  async previous(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.ObjectNavigator.commands.MoveToPreviousSibling.execute();
    });
  }

  /**
   * Move the Orca cursor to the next location.
   *
   * Equivalent of executing `Down Arrow`.
   *
   * ```ts
   * import { unstable_orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await unstable_orca.start();
   *
   *   // Move to the next item.
   *   await unstable_orca.next();
   *
   *   // Stop Orca.
   *   await unstable_orca.stop();
   * })();
   * ```
   */
  async next(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.ObjectNavigator.commands.MoveToNextSibling;
    });
  }

  /**
   * Move the Orca cursor to the previous heading.
   *
   * Equivalent of executing `Shift-H`.
   *
   * ```ts
   * import { unstable_orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await unstable_orca.start();
   *
   *   // Move to the previous heading.
   *   await unstable_orca.previousHeading();
   *
   *   // Stop Orca.
   *   await unstable_orca.stop();
   * })();
   * ```
   *
   * @param {object} [options] Additional options.
   */
  async previousHeading(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.StructuralNavigator.commands.PreviousHeading.execute();
    });
  }

  /**
   * Move the Orca cursor to the next heading.
   *
   * Equivalent of executing `H`.
   *
   * ```ts
   * import { unstable_orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await unstable_orca.start();
   *
   *   // Move to the next heading.
   *   await unstable_orca.nextHeading();
   *
   *   // Stop Orca.
   *   await unstable_orca.stop();
   * })();
   * ```
   *
   * @param {object} [options] Additional options.
   */
  async nextHeading(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.StructuralNavigator.commands.NextHeading.execute();
    });
  }

  /**
   * Move the Orca cursor to the previous link.
   *
   * Equivalent of executing `Shift-K`.
   *
   * ```ts
   * import { unstable_orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await unstable_orca.start();
   *
   *   // Move to the previous link.
   *   await unstable_orca.previousLink();
   *
   *   // Stop Orca.
   *   await unstable_orca.stop();
   * })();
   * ```
   *
   * @param {object} [options] Additional options.
   */
  async previousLink(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.StructuralNavigator.commands.PreviousLink.execute();
    });
  }

  /**
   * Move the Orca cursor to the next link.
   *
   * Equivalent of executing `K`.
   *
   * ```ts
   * import { unstable_orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await unstable_orca.start();
   *
   *   // Move to the next link.
   *   await unstable_orca.nextLink();
   *
   *   // Stop Orca.
   *   await unstable_orca.stop();
   * })();
   * ```
   *
   * @param {object} [options] Additional options.
   */
  async nextLink(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.StructuralNavigator.commands.NextLink.execute();
    });
  }

  /**
   * Move the Orca cursor to the previous landmark.
   *
   * Equivalent of executing `Shift-D`.
   *
   * ```ts
   * import { unstable_orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await unstable_orca.start();
   *
   *   // Move to the previous landmark.
   *   await unstable_orca.previousLandmark();
   *
   *   // Stop Orca.
   *   await unstable_orca.stop();
   * })();
   * ```
   *
   * @param {object} [options] Additional options.
   */
  async previousLandmark(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.StructuralNavigator.commands.PreviousLandmark.execute();
    });
  }

  /**
   * Move the Orca cursor to the next landmark.
   *
   * Equivalent of executing `D`.
   *
   * ```ts
   * import { unstable_orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await unstable_orca.start();
   *
   *   // Move to the next landmark.
   *   await unstable_orca.nextLandmark();
   *
   *   // Stop Orca.
   *   await unstable_orca.stop();
   * })();
   * ```
   *
   * @param {object} [options] Additional options.
   */
  async nextLandmark(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.StructuralNavigator.commands.NextLandmark.execute();
    });
  }

  /**
   * Perform the default action for the item in the Orca cursor.
   *
   * Equivalent of executing `Enter`.
   *
   * ```ts
   * import { unstable_orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await unstable_orca.start();
   *
   *   // Move to the next item.
   *   await unstable_orca.next();
   *
   *   // Perform the default action for the item.
   *   await unstable_orca.act();
   *
   *   // Stop Orca.
   *   await unstable_orca.stop();
   * })();
   * ```
   */
  async act(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service.ObjectNavigator.commands.PerformAction.execute();
    });
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

    return Promise.resolve();
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

    return Promise.resolve();
  }

  // TODO: implementation.
  /**
   * Not implemented.
   */
  async press(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  // TODO: implementation.
  /**
   * Not implemented.
   */
  async type(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  /**
   * Perform an Orca command.
   *
   * The command can be any `OrcaKeyCodeCommand`.
   *
   * ```ts
   * import { unstable_orca, orcaKeyCodeCommands } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await unstable_orca.start();
   *
   *   // Keyboard commands available on the Orca instance.
   *   await unstable_orca.perform(unstable_orca.keyboardCommands.MoveToNextSibling);
   *
   *   // Stop NVDA.
   *   await unstable_orca.stop();
   * })();
   * ```
   *
   * @param {any} command Orca keyboard command to execute.
   */
  async perform(command: KeyCodeCommand): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    await this.#client.enqueueAndTap(async () => {
      await this.#client.service[command.service].commands[
        command.command
      ].execute();
    });
  }

  /**
   * Click the mouse.
   *
   * ```ts
   * import { unstable_orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await unstable_orca.start();
   *
   *   // Left-click the mouse.
   *   await unstable_orca.click();
   *
   *   // Left-click the mouse using specific options.
   *   await unstable_orca.click({ button: "left", clickCount: 1 });
   *
   *   // Double-right-click the mouse.
   *   await unstable_orca.click({ button: "right", clickCount: 2 });
   *
   *   // Stop Orca.
   *   await unstable_orca.stop();
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

    const clickCount = options.clickCount ?? 1;

    await this.#client.enqueueAndTap(async () => {
      for (let i = 0; i < clickCount; i++) {
        await command.execute();
      }
    });
  }

  // TODO: implementation.
  /**
   * Not implemented
   */
  async lastSpokenPhrase(): Promise<string> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  // TODO: implementation.
  /**
   * Not implemented
   */
  async itemText(): Promise<string> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  // TODO: implementation.
  /**
   * Not implemented
   */
  async spokenPhraseLog(): Promise<string[]> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  // TODO: implementation.
  /**
   * Not implemented
   */
  async clearSpokenPhraseLog(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  // TODO: implementation.
  /**
   * Not implemented
   */
  async itemTextLog(): Promise<string[]> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  // TODO: implementation.
  /**
   * Not implemented
   */
  async clearItemTextLog(): Promise<void> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    notImplemented();
  }

  // TODO: implementation.
  /**
   * Not implemented
   */
  getSettings(): Record<string, unknown> {
    notImplemented();
  }

  // TODO: implementation.
  /**
   * Not implemented
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
   * @returns {Promise<Capture<T>>} The action's result and captured Orca output.
   */
  async capture<T>(action: () => Promise<T> | T): Promise<Capture<T>> {
    if (!this.#started || this.#stopping) {
      throw new Error(ERR_ORCA_NOT_RUNNING);
    }

    return await this.#client.enqueueAndTap(async () => action());
  }
}
