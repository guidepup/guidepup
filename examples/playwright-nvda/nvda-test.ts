import { nvda, WindowsKeyCodes, WindowsModifiers } from "../../lib";
import { test } from "@playwright/test";

const applicationNameMap = {
  chromium: "Chromium",
  chrome: "Google Chrome",
  "chrome-beta": "Google Chrome Beta",
  msedge: "Microsoft Edge",
  "msedge-beta": "Microsoft Edge Beta",
  "msedge-dev": "Microsoft Edge Dev",
  firefox: "Nightly",
  webkit: "Playwright",
};

/**
 * These tests extend the default Playwright environment that launches the
 * browser with a running instance of the NVDA screen reader for Windows.
 *
 * A fresh started NVDA instance `nvda` is provided to each test.
 */
const nvdaTest = test.extend<{ nvda: typeof nvda }>({
  nvda: async ({ browserName, page }, use) => {
    try {
      const applicationName = applicationNameMap[browserName];

      if (!applicationName) {
        throw new Error(`Browser ${browserName} is not installed.`);
      }

      await nvda.start();
      await page.goto("about:blank", { waitUntil: "load" });

      // eslint-disable-next-line no-constant-condition
      let applicationSwitchRetryCount = 0;

      while (applicationSwitchRetryCount < 10) {
        applicationSwitchRetryCount++;

        await nvda.perform({
          keyCode: [WindowsKeyCodes.Tab],
          modifiers: [WindowsModifiers.Alt],
        });

        const lastSpokenPhrase = await nvda.lastSpokenPhrase();

        if (lastSpokenPhrase.includes(applicationName)) {
          break;
        }
      }

      if (browserName === "chromium") {
        let mainPageFocusRetryCount = 0;

        // Get to the main page - sometimes focus can land on the address bar
        while (
          !(await nvda.lastSpokenPhrase()).includes("document") &&
          mainPageFocusRetryCount < 10
        ) {
          mainPageFocusRetryCount++;

          await nvda.press("F6");
        }
      } else if (browserName === "firefox") {
        // Force focus to somewhere in the web content
        await page.locator("body").first().focus();
      }

      // Make sure not in focus mode
      await nvda.perform(nvda.keyboardCommands.exitFocusMode);

      // Clear the log so clean for the actual test!
      await nvda.clearSpokenPhraseLog();

      await use(nvda);
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
