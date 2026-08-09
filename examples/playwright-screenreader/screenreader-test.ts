import type { CommandOptions, ScreenReader } from "../../src";
import {
  macOSActivate,
  MacOSKeyCodes,
  nvda,
  NVDAKeyCodeCommands,
  screenReader,
  voiceOver,
  voiceOverKeyCodeCommands,
  WindowsKeyCodes,
  WindowsModifiers,
} from "../../src";
import { applicationNameMap } from "../applicationNameMap";
import { delay } from "../../src/delay";
import type { StartOptions } from "../../src/StartOptions";
import { test } from "@playwright/test";

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type CaptureCommandOptions = Prettify<Pick<CommandOptions, "capture">>;
type CaptureStartOptions = Prettify<Pick<StartOptions, "capture" | "settings">>;

const MAX_APPLICATION_SWITCH_RETRY_COUNT = 10;

const SWITCH_APPLICATION = {
  keyCode: [WindowsKeyCodes.Escape],
  modifiers: [WindowsModifiers.Alt],
};

const MOVE_TO_TOP = {
  keyCode: [WindowsKeyCodes.Home],
  modifiers: [WindowsModifiers.Control],
};

type FocusBrowserParams = {
  applicationName: string;
  pageTitle: string;
};

const cleanString = (str: string): string =>
  str
    .toLowerCase()
    // REF: https://github.com/nvaccess/nvda/blob/master/source/locale/en/symbols.dic
    .replace(/[|¦:;'"`\-‐–—·_()[\]{}\\^~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const hasFocus = ({
  applicationName,
  pageTitle,
  windowTitle,
}: FocusBrowserParams & { windowTitle: string }) => {
  const cleanedApplicationName = cleanString(applicationName);
  const cleanedPageTitle = cleanString(pageTitle);
  const cleanedWindowTitle = cleanString(windowTitle);

  return (
    (cleanedPageTitle.length &&
      cleanedWindowTitle.startsWith(cleanedPageTitle)) ||
    cleanedWindowTitle.includes(cleanedApplicationName)
  );
};

const focusBrowser = async ({
  applicationName,
  pageTitle,
}: {
  applicationName: string;
  pageTitle: string;
}) => {
  await screenReaderPlaywright.perform(NVDAKeyCodeCommands.reportTitle);
  let windowTitle = await screenReaderPlaywright.lastSpokenPhrase();

  if (hasFocus({ applicationName, pageTitle, windowTitle })) {
    return;
  }

  let applicationSwitchRetryCount = 0;

  while (applicationSwitchRetryCount < MAX_APPLICATION_SWITCH_RETRY_COUNT) {
    applicationSwitchRetryCount++;

    await screenReaderPlaywright.perform(SWITCH_APPLICATION, {
      capture: false,
    });
    await delay(500);

    await screenReaderPlaywright.perform(NVDAKeyCodeCommands.reportTitle);
    windowTitle = await screenReaderPlaywright.lastSpokenPhrase();

    if (hasFocus({ applicationName, pageTitle, windowTitle })) {
      break;
    }
  }
};

/**
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
   * Options to start the default screen reader with.
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

      if (!applicationName) {
        throw new Error(`Browser ${browserName} is not installed.`);
      }

      if (nvda.default()) {
        screenReaderPlaywright.navigateToWebContent = async ({
          capture,
        } = {}) => {
          const currentSpokenPhraseLog = [
            ...(await screenReaderPlaywright.spokenPhraseLog()),
          ];
          const currentItemTextLog = [
            ...(await screenReaderPlaywright.itemTextLog()),
          ];

          // Make sure NVDA is not in focus mode.
          await screenReaderPlaywright.perform(
            NVDAKeyCodeCommands.exitFocusMode,
            { capture: false },
          );
          await delay(100);

          // Ensure application is brought to front and focused.
          const pageTitle = await page.title();
          await focusBrowser({ applicationName, pageTitle });

          // Ensure the document is ready and focused.
          await page.bringToFront();
          await page.locator("body").waitFor();
          await page.locator("body").focus();
          await page.locator("body").click();
          await page.locator("body").blur();

          // NVDA appears to not work well with Firefox when switching between
          // applications resulting in the entire browser window having NVDA focus
          // with focus mode.
          //
          // One workaround is to tab to the next focusable item. From there we can
          // toggle into (yes although we are already in it...) focus mode and back
          // out. In case this ever transpires to not happen as expect, we then ensure
          // we exit focus mode and move NVDA to the top of the page.
          //
          // REF: https://github.com/nvaccess/nvda/issues/5758
          await screenReaderPlaywright.perform(
            NVDAKeyCodeCommands.readNextFocusableItem,
            { capture: false },
          );
          await delay(100);
          await screenReaderPlaywright.perform(
            NVDAKeyCodeCommands.toggleBetweenBrowseAndFocusMode,
            { capture: false },
          );
          await delay(100);
          await screenReaderPlaywright.perform(
            NVDAKeyCodeCommands.toggleBetweenBrowseAndFocusMode,
            { capture: false },
          );
          await delay(100);
          await screenReaderPlaywright.perform(
            NVDAKeyCodeCommands.exitFocusMode,
            { capture: false },
          );
          await delay(100);

          await screenReaderPlaywright.clearSpokenPhraseLog();
          await screenReaderPlaywright.clearItemTextLog();

          const spokenPhraseLog =
            await screenReaderPlaywright.spokenPhraseLog();
          const itemTextLog = await screenReaderPlaywright.itemTextLog();

          spokenPhraseLog.push(...currentSpokenPhraseLog);
          itemTextLog.push(...currentItemTextLog);

          // Navigate to the beginning of the web content, using chosen capture
          // settings, so don't miss announcing the first item on the page.
          await screenReaderPlaywright.perform(MOVE_TO_TOP, { capture });
        };
      } else if (voiceOver.default()) {
        screenReaderPlaywright.navigateToWebContent = async ({
          capture,
        } = {}) => {
          // Ensure application is brought to front and focused.
          await macOSActivate(applicationName);

          // Cancel auto navigation.
          await screenReaderPlaywright.perform(
            { keyCode: MacOSKeyCodes.Control },
            { capture: false },
          );
          await delay(100);

          // Ensure the document is ready and focused.
          await page.bringToFront();
          await page.locator("body").waitFor();

          try {
            // Add an interactive marker to the page that will force VoiceOver
            // to listen to events emitted by Playwright interactions when
            // navigated to.
            await page.evaluate(() => {
              const marker = document.createElement("input");

              marker.id = "__guidepup_marker__";
              marker.type = "text";
              marker.value = "Guidepup Marker";
              marker.readOnly = true;
              marker.tabIndex = -1;
              marker.autocomplete = "off";
              marker.setAttribute("aria-label", "Guidepup Marker");
              marker.style.cssText = `
              position: absolute;
              width: 1px;
              height: 1px;
              overflow: hidden;
              clip: rect(0 0 0 0);
              white-space: nowrap;
            `;

              document.body.prepend(marker);
            });

            // Open the web item chooser.
            await screenReaderPlaywright.perform(
              voiceOverKeyCodeCommands.openItemChooser,
              { capture: false },
            );
            await delay(500);

            // Filter by "web content" - currently web content items for all browsers
            // are suffixed by "web content".
            for (const character of "web content") {
              await screenReaderPlaywright.type(character, { capture: false });
              await delay(100);
            }

            // Select the web content window spot.
            await screenReaderPlaywright.perform(
              { keyCode: MacOSKeyCodes.Enter },
              { capture: false },
            );
            await delay(100);

            // Navigate into web content.
            await screenReaderPlaywright.interact({ capture: false });
            await delay(100);

            // Navigate to the beginning of the web content.
            await screenReaderPlaywright.perform(
              voiceOverKeyCodeCommands.moveToBeginningOfText,
              { capture: false },
            );
            await delay(100);

            // Cancel auto navigation
            await screenReaderPlaywright.perform(
              { keyCode: MacOSKeyCodes.Control },
              { capture: false },
            );
            await delay(100);

            // Navigate to the Guidepup marker element at beginning of the web
            // content.
            await screenReaderPlaywright.perform(
              voiceOverKeyCodeCommands.moveToBeginningOfText,
              { capture: false },
            );
            await delay(100);

            // Navigate to the first element of the page using the provided
            // capture settings.
            await screenReaderPlaywright.next({ capture });
          } finally {
            // Remove the temporary Guidepup marker element to restore original
            // page structure.
            await page.evaluate(() => {
              const marker = document.querySelector("#__guidepup_marker__");

              if (marker) {
                document.body.removeChild(marker);
              }
            });
          }
        };
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
