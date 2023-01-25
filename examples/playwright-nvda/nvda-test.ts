/* eslint-disable no-empty-pattern */
import { nvda } from "../../lib";
import { test } from "@playwright/test";

// const applicationNameMap = {
//   chromium: "Chromium",
//   chrome: "Google Chrome",
//   "chrome-beta": "Google Chrome Beta",
//   msedge: "Microsoft Edge",
//   "msedge-beta": "Microsoft Edge Beta",
//   "msedge-dev": "Microsoft Edge Dev",
//   firefox: "Nightly",
//   webkit: "Playwright",
// };

/**
 * These tests extend the default Playwright environment that launches the
 * browser with a running instance of the VoiceOver screen reader for MacOS.
 *
 * A fresh started VoiceOver instance `vo` is provided to each test.
 */
const voTest = test.extend<{ nvda: typeof nvda }>({
  nvda: async ({ browserName }, use) => {
    try {
      await nvda.start();
      // TODO: focus the browser
      console.log({ browserName });
      // await windowsActivate(applicationNameMap[browserName]);
      await use(nvda);
    } finally {
      await nvda.stop();
    }
  },
});

export { voTest };
