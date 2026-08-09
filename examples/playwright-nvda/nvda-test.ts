import { NVDA, nvda, WindowsKeyCodes, WindowsModifiers } from "../../src";
import { applicationNameMap } from "../applicationNameMap";
import type { CommandOptions } from "../../src";
import { delay } from "../../src/delay";
import type { StartOptions } from "../../src/StartOptions";
import { test } from "@playwright/test";

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type CaptureCommandOptions = Prettify<Pick<CommandOptions, "capture">>;
type CaptureStartOptions = Prettify<Pick<StartOptions, "capture" | "settings">>;

/**
 * [API Reference](https://www.guidepup.dev/docs/api/class-nvda)
 *
 * This object can be used to launch and control NVDA.
 *
 * Here's a typical example:
 *
 * ```ts
 * import { nvda } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Start NVDA.
 *   await nvda.start();
 *
 *   // Move to the next item.
 *   await nvda.next();
 *
 *   // Stop NVDA.
 *   await nvda.stop();
 * })();
 * ```
 */
export interface NVDAPlaywright extends NVDA {
  /**
   * Guidepup Playwright specific command that navigates NVDA to the beginning
   * of the browser's web content.
   *
   * This command should be used after page navigation.
   */
  navigateToWebContent(options?: CaptureCommandOptions): Promise<void>;
}

const nvdaPlaywright: NVDAPlaywright = nvda as NVDAPlaywright;

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
  await nvdaPlaywright.perform(nvdaPlaywright.keyboardCommands.reportTitle);
  let windowTitle = await nvdaPlaywright.lastSpokenPhrase();

  if (hasFocus({ applicationName, pageTitle, windowTitle })) {
    return;
  }

  let applicationSwitchRetryCount = 0;

  while (applicationSwitchRetryCount < MAX_APPLICATION_SWITCH_RETRY_COUNT) {
    applicationSwitchRetryCount++;

    await nvdaPlaywright.perform(SWITCH_APPLICATION, { capture: false });
    await delay(500);

    await nvdaPlaywright.perform(nvdaPlaywright.keyboardCommands.reportTitle);
    windowTitle = await nvdaPlaywright.lastSpokenPhrase();

    if (hasFocus({ applicationName, pageTitle, windowTitle })) {
      break;
    }
  }
};

/**
 * These tests extend the default Playwright environment that launches the
 * browser with a running instance of the NVDA screen reader for Windows.
 *
 * A fresh started NVDA instance `nvda` is provided to each test.
 */
export const nvdaTest = test.extend<{
  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-nvda)
   *
   * This object can be used to launch and control NVDA.
   *
   * Here's a typical example:
   *
   * ```ts
   * import { nvda } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start NVDA.
   *   await nvda.start();
   *
   *   // Move to the next item.
   *   await nvda.next();
   *
   *   // Stop NVDA.
   *   await nvda.stop();
   * })();
   * ```
   */
  nvda: NVDAPlaywright;
  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-command-options)
   *
   * Options to start NVDA with, see also [nvda.start([options])](https://www.guidepup.dev/docs/api/class-nvda#nvda-start).
   */
  nvdaStartOptions: CaptureStartOptions;
}>({
  nvdaStartOptions: { capture: "initial" },
  nvda: async ({ browserName, page, nvdaStartOptions }, use) => {
    try {
      const applicationName = applicationNameMap[browserName];

      if (!applicationName) {
        throw new Error(`Browser ${browserName} is not installed.`);
      }

      nvdaPlaywright.navigateToWebContent = async ({ capture } = {}) => {
        const currentSpokenPhraseLog = [
          ...(await nvdaPlaywright.spokenPhraseLog()),
        ];
        const currentItemTextLog = [...(await nvdaPlaywright.itemTextLog())];

        // Make sure NVDA is not in focus mode.
        await nvdaPlaywright.perform(
          nvdaPlaywright.keyboardCommands.exitFocusMode,
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
        await nvdaPlaywright.perform(
          nvdaPlaywright.keyboardCommands.readNextFocusableItem,
          { capture: false },
        );
        await delay(100);
        await nvdaPlaywright.perform(
          nvdaPlaywright.keyboardCommands.toggleBetweenBrowseAndFocusMode,
          { capture: false },
        );
        await delay(100);
        await nvdaPlaywright.perform(
          nvdaPlaywright.keyboardCommands.toggleBetweenBrowseAndFocusMode,
          { capture: false },
        );
        await delay(100);
        await nvdaPlaywright.perform(
          nvdaPlaywright.keyboardCommands.exitFocusMode,
          { capture: false },
        );
        await delay(100);

        await nvdaPlaywright.clearSpokenPhraseLog();
        await nvdaPlaywright.clearItemTextLog();

        const spokenPhraseLog = await nvdaPlaywright.spokenPhraseLog();
        const itemTextLog = await nvdaPlaywright.itemTextLog();

        spokenPhraseLog.push(...currentSpokenPhraseLog);
        itemTextLog.push(...currentItemTextLog);

        // Navigate to the beginning of the web content, using chosen capture
        // settings, so don't miss announcing the first item on the page.
        await nvdaPlaywright.perform(MOVE_TO_TOP, { capture });
      };

      await nvdaPlaywright.start(nvdaStartOptions);
      await use(nvdaPlaywright);
    } finally {
      try {
        await nvdaPlaywright.stop();
      } catch {
        // swallow stop failure
      }
    }
  },
});
