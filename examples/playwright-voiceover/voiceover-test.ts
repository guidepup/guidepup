import { macOSActivate, voiceOver } from "../../lib";
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
 * browser with a running instance of the VoiceOver screen reader for MacOS.
 *
 * A fresh started VoiceOver instance `vo` is provided to each test.
 */
const voTest = test.extend<{ voiceOver: typeof voiceOver }>({
  voiceOver: async ({ browserName }, use) => {
    try {
      await voiceOver.start();
      await macOSActivate(applicationNameMap[browserName]);
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
