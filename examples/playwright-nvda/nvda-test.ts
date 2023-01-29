/* eslint-disable no-empty-pattern */
import {
  nvda,
  windowsActivate,
  WindowsKeyCodes,
  WindowsModifiers,
} from "../../lib";
import { homedir } from "os";
import { join } from "path";
import { readdirSync } from "fs";
import { test } from "@playwright/test";

const BROWSER_INSTALLATION_DIRECTORY = join(
  homedir(),
  "AppData",
  "Local",
  "ms-playwright"
);

const CHROMIUM_PATH = join("chrome-win", "chrome.exe");
const FIREFOX_PATH = join("firefox", "firefox.exe");

const directories = readdirSync(BROWSER_INSTALLATION_DIRECTORY, {
  withFileTypes: true,
}).filter((item) => item.isDirectory());

const chromiumDirectory = directories
  .filter((directory) => directory.name.startsWith("chromium"))
  .sort(byLatestRevision)
  .at(0)?.name;

const firefoxDirectory = directories
  .filter((directory) => directory.name.startsWith("firefox"))
  .sort(byLatestRevision)
  .at(0)?.name;

function byLatestRevision(directoryA, directoryB) {
  const revisionA = directoryA.split("-").at(-1);
  const revisionB = directoryB.split("-").at(-1);

  return revisionB - revisionA;
}

const applicationNameMap = {
  chromium: chromiumDirectory
    ? {
        path: join(
          BROWSER_INSTALLATION_DIRECTORY,
          chromiumDirectory,
          CHROMIUM_PATH
        ),
        name: "Chromium",
      }
    : null,
  firefox: firefoxDirectory
    ? {
        path: join(
          BROWSER_INSTALLATION_DIRECTORY,
          firefoxDirectory,
          FIREFOX_PATH
        ),
        name: "Nightly",
      }
    : null,
};

/**
 * These tests extend the default Playwright environment that launches the
 * browser with a running instance of the VoiceOver screen reader for MacOS.
 *
 * A fresh started VoiceOver instance `vo` is provided to each test.
 */
const voTest = test.extend<{ nvda: typeof nvda }>({
  nvda: async ({ browserName }, use) => {
    try {
      const application = applicationNameMap[browserName];

      if (!application) {
        throw new Error(`Browser ${browserName} is not installed.`);
      }

      await nvda.start();
      await windowsActivate(application.path, application.name);

      // eslint-disable-next-line no-constant-condition
      while (true) {
        console.info("[test]: Performing Alt-Tab");
        await nvda.perform({
          keyCode: [WindowsKeyCodes.Tab],
          modifiers: [WindowsModifiers.Alt],
        });

        const lastSpokenPhrase = await nvda.lastSpokenPhrase();
        console.info("[test]: Got Last Spoken Phrase", { lastSpokenPhrase });

        if (lastSpokenPhrase.includes(application.name)) {
          break;
        }
      }

      await use(nvda);
    } finally {
      await nvda.stop();
    }
  },
});

export { voTest };
