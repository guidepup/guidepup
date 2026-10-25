import type { CommandOptions, ScreenReader } from "../../src";
import { nvda, orca, screenReader, voiceOver } from "../../src";
import { applicationIdMap } from "../applicationIdMap";
import { applicationNameMap } from "../applicationNameMap";
import { navigateNVDAtoWebContent } from "../playwright-nvda/navigateToWebContent";
import { navigateOrcaToWebContent } from "../playwright-orca/navigateToWebContent";
import { navigateVoiceOverToWebContent } from "../playwright-voiceover/navigateToWebContent";
import type { StartOptions } from "../../src/StartOptions";
import { test } from "@playwright/test";

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type CaptureCommandOptions = Prettify<Pick<CommandOptions, "capture">>;
type CaptureStartOptions = Prettify<Pick<StartOptions, "capture" | "settings">>;

/**
 * [API Reference](https://www.guidepup.dev/docs/api/class-screenreader)
 *
 * This object can be used to launch and control the default screen reader for
 * the environment.
 *
 * Here's a typical example:
 *
 * ```ts
 * import { screenReader } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Start the screen reader.
 *   await screenReader.start();
 *
 *   // Move to the next item.
 *   await screenReader.next();
 *
 *   // ... perform some commands.
 *
 *   // Stop the screen reader.
 *   await screenReader.stop();
 * })();
 * ```
 */
export interface ScreenReaderPlaywright extends ScreenReader {
  /**
   * Guidepup Playwright specific command that navigates the screen reader to
   * the beginning of the browser's web content.
   *
   * This command should be used after page navigation.
   */
  navigateToWebContent(options?: CaptureCommandOptions): Promise<void>;
}

const screenReaderPlaywright: ScreenReaderPlaywright =
  screenReader as ScreenReaderPlaywright;

/**
 * These tests extend the default Playwright environment that launches the
 * browser with a running instance of the default screen reader for the current
 * OS.
 *
 * A fresh started screen reader instance `screenReader` is provided to each
 * test.
 */
export const screenReaderTest = test.extend<{
  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-screenreader)
   *
   * This object can be used to launch and control the default screen reader for
   * the environment.
   *
   * Here's a typical example:
   *
   * ```ts
   * import { screenReader } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start the screen reader.
   *   await screenReader.start();
   *
   *   // Move to the next item.
   *   await screenReader.next();
   *
   *   // ... perform some commands.
   *
   *   // Stop the screen reader.
   *   await screenReader.stop();
   * })();
   * ```
   */
  screenReader: ScreenReaderPlaywright;
  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-start-options)
   *
   * Options to start the default screen reader with, see also [screenReader.start([options])](https://www.guidepup.dev/docs/api/class-screenreader#screenreader-start).
   */
  screenReaderStartOptions: CaptureStartOptions;
}>({
  screenReaderStartOptions: { capture: "initial" },
  screenReader: async (
    { browserName, page, screenReaderStartOptions },
    use,
  ) => {
    try {
      const applicationName = applicationNameMap[browserName];
      const applicationId = applicationIdMap[browserName];

      if (!applicationName || !applicationId) {
        throw new Error(`Browser ${browserName} is not recognised.`);
      }

      if (nvda.default()) {
        screenReaderPlaywright.navigateToWebContent = ({ capture } = {}) =>
          navigateNVDAtoWebContent({
            nvda,
            page,
            applicationName,
            capture,
          });
      } else if (voiceOver.default()) {
        screenReaderPlaywright.navigateToWebContent = ({ capture } = {}) =>
          navigateVoiceOverToWebContent({
            voiceOver,
            page,
            applicationId,
            capture,
          });
      } else if (orca.default()) {
        screenReaderPlaywright.navigateToWebContent = ({ capture } = {}) =>
          navigateOrcaToWebContent({
            orca: orca,
            page,
            capture,
          });
      } else {
        throw new Error("No supported screen reader");
      }

      await screenReaderPlaywright.start(screenReaderStartOptions);
      await use(screenReaderPlaywright);
    } finally {
      try {
        await screenReaderPlaywright.stop();
      } catch {
        // swallow stop failure
      }
    }
  },
});
