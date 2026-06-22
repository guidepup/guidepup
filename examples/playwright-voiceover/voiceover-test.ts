import { macOSActivate, MacOSKeyCodes, voiceOver } from "../../src";
import { test } from "@playwright/test";
import type { VoiceOver } from "../../src";

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

export interface VoiceOverPlaywright extends VoiceOver {
  /**
   * Guidepup Playwright specific command that navigates VoiceOver to the beginning
   * of the browser's web content.
   *
   * This command should be used after page navigation.
   *
   * Note: this command clears all logs.
   */
  navigateToWebContent(): Promise<void>;
}

const voiceOverPlaywright: VoiceOverPlaywright =
  voiceOver as VoiceOverPlaywright;

/**
 * These tests extend the default Playwright environment that launches the
 * browser with a running instance of the VoiceOver screen reader for MacOS.
 *
 * A fresh started VoiceOver instance `vo` is provided to each test.
 */
const voTest = test.extend<{ voiceOver: VoiceOverPlaywright }>({
  voiceOver: async ({ browserName, page }, use) => {
    try {
      const applicationName = applicationNameMap[browserName];

      if (!applicationName) {
        throw new Error(`Browser ${browserName} is not installed.`);
      }

      voiceOverPlaywright.navigateToWebContent = async (
        clearLogs: boolean = true,
      ) => {
        await macOSActivate(applicationName);

        await voiceOverPlaywright.perform({ keyCode: MacOSKeyCodes.Control });

        await page.bringToFront();
        await page.locator("body").waitFor();

        await voiceOverPlaywright.perform(
          voiceOverPlaywright.keyboardCommands.openItemChooser,
        );

        await voiceOverPlaywright.type("web content");

        await voiceOverPlaywright.perform({ keyCode: MacOSKeyCodes.Enter });

        await voiceOverPlaywright.interact();

        await voiceOverPlaywright.perform(
          voiceOverPlaywright.keyboardCommands.moveToBeginningOfText,
        );

        await voiceOverPlaywright.perform({ keyCode: MacOSKeyCodes.Control });

        if (clearLogs) {
          await voiceOverPlaywright.clearItemTextLog();
          await voiceOverPlaywright.clearSpokenPhraseLog();
        }
      };

      await voiceOverPlaywright.start({ capture: "initial" });

      await use(voiceOverPlaywright);
    } finally {
      try {
        await voiceOverPlaywright.stop();
      } catch {
        // swallow stop failure
      }
    }
  },
});

export { voTest };
