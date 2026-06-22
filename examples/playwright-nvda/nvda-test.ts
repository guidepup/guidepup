import { NVDA, nvda, WindowsKeyCodes, WindowsModifiers } from "../../lib";
import { test } from "@playwright/test";

export const applicationNameMap = {
  chromium: "Google Chrome For Testing",
  chrome: "Google Chrome",
  "chrome-beta": "Google Chrome Beta",
  msedge: "Microsoft Edge",
  "msedge-beta": "Microsoft Edge Beta",
  "msedge-dev": "Microsoft Edge Dev",
  firefox: "Nightly",
  webkit: "Playwright",
};

export interface NVDAPlaywright extends NVDA {
  navigateToWebContent(): Promise<void>;
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

    await nvdaPlaywright.perform(SWITCH_APPLICATION);
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
const nvdaTest = test.extend<{ nvda: NVDAPlaywright }>({
  nvda: async ({ browserName, page }, use) => {
    try {
      const applicationName = applicationNameMap[browserName];

      if (!applicationName) {
        throw new Error(`Browser ${browserName} is not installed.`);
      }

      nvdaPlaywright.navigateToWebContent = async () => {
        await nvdaPlaywright.perform(
          nvdaPlaywright.keyboardCommands.exitFocusMode,
        );

        const pageTitle = await page.title();
        await focusBrowser({ applicationName, pageTitle });

        await page.bringToFront();
        await page.locator("body").waitFor();
        await page.locator("body").focus();
        await page.locator("body").click();

        await nvdaPlaywright.perform(
          nvdaPlaywright.keyboardCommands.readNextFocusableItem,
        );
        await nvdaPlaywright.perform(
          nvdaPlaywright.keyboardCommands.toggleBetweenBrowseAndFocusMode,
        );
        await nvdaPlaywright.perform(
          nvdaPlaywright.keyboardCommands.toggleBetweenBrowseAndFocusMode,
        );
        await nvdaPlaywright.perform(
          nvdaPlaywright.keyboardCommands.exitFocusMode,
        );
        await nvdaPlaywright.perform(MOVE_TO_TOP);

        await nvdaPlaywright.clearItemTextLog();
        await nvdaPlaywright.clearSpokenPhraseLog();
      };

      await nvdaPlaywright.start({ capture: "initial" });

      await use(nvdaPlaywright);
    } finally {
      try {
        await nvda.stop();
      } catch {
        // swallow stop failure
      }
    }
  },
});

export { nvdaTest };
