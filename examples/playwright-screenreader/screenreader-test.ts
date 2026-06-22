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
import type { ScreenReader } from "../../src";
import { test } from "@playwright/test";

const applicationNameMap = {
  chromium: "Google Chrome For Testing",
  chrome: "Google Chrome",
  "chrome-beta": "Google Chrome Beta",
  msedge: "Microsoft Edge",
  "msedge-beta": "Microsoft Edge Beta",
  "msedge-dev": "Microsoft Edge Dev",
  firefox: "Nightly",
  webkit: "Playwright",
};

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

    await screenReaderPlaywright.perform(SWITCH_APPLICATION);
    await screenReaderPlaywright.perform(NVDAKeyCodeCommands.reportTitle);
    windowTitle = await screenReaderPlaywright.lastSpokenPhrase();

    if (hasFocus({ applicationName, pageTitle, windowTitle })) {
      break;
    }
  }
};

export interface ScreenReaderPlaywright extends ScreenReader {
  /**
   * Guidepup Playwright specific command that navigates the screen reader to
   * the beginning of the browser's web content.
   *
   * This command should be used after page navigation.
   *
   * Note: this command clears all logs.
   */
  navigateToWebContent(): Promise<void>;
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
const srTest = test.extend<{ screenReader: ScreenReaderPlaywright }>({
  screenReader: async ({ browserName, page }, use) => {
    try {
      const applicationName = applicationNameMap[browserName];

      if (!applicationName) {
        throw new Error(`Browser ${browserName} is not installed.`);
      }

      if (nvda.default()) {
        screenReaderPlaywright.navigateToWebContent = async () => {
          await screenReaderPlaywright.perform(
            NVDAKeyCodeCommands.exitFocusMode,
          );

          const pageTitle = await page.title();
          await focusBrowser({ applicationName, pageTitle });

          await page.bringToFront();
          await page.locator("body").waitFor();
          await page.locator("body").focus();
          await page.locator("body").click();

          await screenReaderPlaywright.perform(
            NVDAKeyCodeCommands.readNextFocusableItem,
          );
          await screenReaderPlaywright.perform(
            NVDAKeyCodeCommands.toggleBetweenBrowseAndFocusMode,
          );
          await screenReaderPlaywright.perform(
            NVDAKeyCodeCommands.toggleBetweenBrowseAndFocusMode,
          );
          await screenReaderPlaywright.perform(
            NVDAKeyCodeCommands.exitFocusMode,
          );
          await screenReaderPlaywright.perform(MOVE_TO_TOP);

          await screenReaderPlaywright.clearItemTextLog();
          await screenReaderPlaywright.clearSpokenPhraseLog();
        };
      } else if (voiceOver.default()) {
        screenReaderPlaywright.navigateToWebContent = async (
          clearLogs: boolean = true,
        ) => {
          await macOSActivate(applicationName);

          await screenReaderPlaywright.perform({
            keyCode: MacOSKeyCodes.Control,
          });

          await page.bringToFront();
          await page.locator("body").waitFor();

          await screenReaderPlaywright.perform(
            voiceOverKeyCodeCommands.openItemChooser,
          );

          await screenReaderPlaywright.type("web content");

          await screenReaderPlaywright.perform({
            keyCode: MacOSKeyCodes.Enter,
          });

          await screenReaderPlaywright.interact();

          await screenReaderPlaywright.perform(
            voiceOverKeyCodeCommands.moveToBeginningOfText,
          );

          await screenReaderPlaywright.perform({
            keyCode: MacOSKeyCodes.Control,
          });

          if (clearLogs) {
            await screenReaderPlaywright.clearItemTextLog();
            await screenReaderPlaywright.clearSpokenPhraseLog();
          }
        };
      } else {
        throw new Error("No supported screen reader");
      }

      await screenReaderPlaywright.start({ capture: "initial" });

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

export { srTest };
