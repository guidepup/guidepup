import { test } from "@playwright/test";
import { voiceOver } from "../../lib";

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
 * browser with a running instance of the VoiceOver screen reader for MacOS.
 *
 * A fresh started VoiceOver instance `vo` is provided to each test.
 */
const voTest = test.extend<{ voiceOver: typeof voiceOver }>({
  voiceOver: async ({ browserName, page }, use) => {
    try {
      const applicationName = applicationNameMap[browserName];

      if (!applicationName) {
        throw new Error(`Browser ${browserName} is not installed.`);
      }

      await voiceOver.start();
      await page.goto("about:blank", { waitUntil: "load" });

      await voiceOver.perform(
        voiceOver.keyboardCommands.openApplicationChooser
      );

      let applicationSwitchRetryCount = 0;

      while (applicationSwitchRetryCount < 10) {
        applicationSwitchRetryCount++;

        await voiceOver.perform(voiceOver.keyboardCommands.moveDown);

        const lastSpokenPhrase = await voiceOver.lastSpokenPhrase();

        if (lastSpokenPhrase.includes(applicationName)) {
          break;
        }
      }

      await voiceOver.next();
      await voiceOver.act();

      // Force focus to somewhere in the web content
      await page.locator("body").first().focus();
      await voiceOver.perform(voiceOver.keyboardCommands.jumpToLeftEdge);

      // Clear the log so clean for the actual test!
      await voiceOver.clearSpokenPhraseLog();
      await voiceOver.clearItemTextLog();

      await use(voiceOver);
    } finally {
      try {
        await voiceOver.stop();
      } catch {
        // swallow stop failure
      }
    }
  },
});

export { voTest };
