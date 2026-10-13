import { platform, release } from "os";
import { delay } from "../../../../src/delay";
import { expect } from "@playwright/test";
import { log } from "../../../log";
import { screenReaderTest as test } from "../../screenreader-test";

const MAX_NAVIGATION_LOOP = 10;

const record = async (filepath: string) => {
  try {
    const { record: guidepupRecord } = await import("@guidepup/record");

    return guidepupRecord(filepath);
  } catch {
    console.warn(
      "@guidepup/record not available. Recording will be skipped. This is expected on platforms without ffmpeg support (e.g., Windows ARM64).",
    );
  }
};

test.describe("Firefox Playwright Screen Reader: Orca", () => {
  test("I can capture live region screen reader output from Orca commands (Object Navigator Click)", async ({
    browser,
    browserName,
    page,
    screenReader,
  }) => {
    const osName = platform();
    const osVersion = release();
    const browserVersion = browser.version();
    const screenReaderName = screenReader.name;
    const screenReaderVersion = screenReader.version;
    const { retry } = test.info();
    const recordingFilePath = `./recordings/playwright-screenreader-live-region-orca-commands-${osName}-${osVersion}-${browserName}-${browserVersion}-attempt-${retry}-${+new Date()}.mov`;

    console.table({
      osName,
      osVersion,
      browserName,
      browserVersion,
      screenReaderName,
      screenReaderVersion,
      retry,
    });

    let stopRecording: (() => Promise<void>) | undefined;

    try {
      stopRecording = await record(recordingFilePath);

      log("Navigating to live region test page.");

      await page.goto("about:blank", {
        waitUntil: "load",
      });

      // NOTE: Orca does not support `role="alert"` etc.correctly.
      // Authors are required to implement `aria-live` explicitly.
      await page.setContent(`
<!doctype html>
<html>
  <head>
    <title>Guidepup Live Region Test</title>
  </head>
  <body>
    <main>
      <h1>Example 1</h1>
      <button id="trigger">Update</button>
    </main>

    <div aria-live="assertive" role="alert" id="live"></div>

    <script>
      document.querySelector("#trigger").addEventListener("click", () => {
        document.querySelector("#live").textContent = "testing testing 123"
      });
    </script>
  </body>
</html>
    `);

      await page.locator("#trigger").waitFor();
      await delay(500);

      await screenReader.navigateToWebContent();
      await delay(500);

      let navigationCount = 0;

      while (
        !(await screenReader.itemText())
          .replaceAll(/\s/g, "")
          .includes("Update") &&
        navigationCount <= MAX_NAVIGATION_LOOP
      ) {
        navigationCount++;

        log(`Performing command: "Orca+Ctrl+Right Arrow"`);
        await screenReader.next();
        log(
          `Screen reader output: "${await screenReader.lastSpokenPhrase()}".`,
        );
      }

      // TODO: potential bug in Orca - using object navigator to place Orca on
      // a button and then `Orca+Ctrl+Enter` to activate it does not announce a
      // live region _unless_ focus is first place on the button.
      // REF: https://github.com/guidepup/guidepup/pull/143#issuecomment-6106014653
      await page.locator("#trigger").focus();
      await delay(500);

      log(`Performing command: "Orca+Ctrl+Enter"`);
      await screenReader.act();
      const clickSpokenPhrase = await screenReader.lastSpokenPhrase();
      log(`Screen reader output: "${clickSpokenPhrase}".`);

      expect(clickSpokenPhrase).toContain("testing testing 123");
    } finally {
      await stopRecording?.();
    }
  });

  test("I can capture live region screen reader output from Orca commands (Playwright Click)", async ({
    browser,
    browserName,
    page,
    screenReader,
  }) => {
    const osName = platform();
    const osVersion = release();
    const browserVersion = browser.version();
    const screenReaderName = screenReader.name;
    const screenReaderVersion = screenReader.version;
    const { retry } = test.info();
    const recordingFilePath = `./recordings/playwright-screenreader-live-region-orca-commands-${osName}-${osVersion}-${browserName}-${browserVersion}-attempt-${retry}-${+new Date()}.mov`;

    console.table({
      osName,
      osVersion,
      browserName,
      browserVersion,
      screenReaderName,
      screenReaderVersion,
      retry,
    });

    let stopRecording: (() => Promise<void>) | undefined;

    try {
      stopRecording = await record(recordingFilePath);

      log("Navigating to live region test page.");

      await page.goto("about:blank", {
        waitUntil: "load",
      });

      // NOTE: Orca does not support `role="alert"` etc.correctly.
      // Authors are required to implement `aria-live` explicitly.
      await page.setContent(`
<!doctype html>
<html>
  <head>
    <title>Guidepup Live Region Test</title>
  </head>
  <body>
    <main>
      <h1>Example 1</h1>
      <button id="trigger">Update</button>
    </main>

    <div aria-live="assertive" role="alert" id="live"></div>

    <script>
      document.querySelector("#trigger").addEventListener("click", () => {
        document.querySelector("#live").textContent = "testing testing 123"
      });
    </script>
  </body>
</html>
    `);

      const button = page.locator("#trigger");
      await button.waitFor();
      await delay(500);

      await screenReader.navigateToWebContent();
      await delay(500);

      let navigationCount = 0;

      while (
        !(await screenReader.itemText())
          .replaceAll(/\s/g, "")
          .includes("Update") &&
        navigationCount <= MAX_NAVIGATION_LOOP
      ) {
        navigationCount++;

        log(`Performing command: "Orca+Ctrl+Right Arrow"`);
        await screenReader.next();
        log(
          `Screen reader output: "${await screenReader.lastSpokenPhrase()}".`,
        );
      }

      // TODO: potential bug in Orca - using object navigator to place Orca on
      // a button and then `Orca+Ctrl+Enter` to activate it does not announce a
      // live region _unless_ focus is first place on the button.
      // REF: https://github.com/guidepup/guidepup/pull/143#issuecomment-6106014653
      await page.locator("#trigger").focus();
      await delay(500);

      log(`Performing capture: Playwright click`);
      const { spokenPhrase: clickSpokenPhrase } = await screenReader.capture(
        () => button.click(),
        {
          // Capture full output as there is potential for multiple phrases:
          //
          // 1. The button itself
          // 2. And the live region announcement
          //
          // And the default capture of "initial" will cut off the announcement.
          capture: true,
        },
      );
      log(`Screen reader output: "${clickSpokenPhrase}".`);

      expect(clickSpokenPhrase).toContain("testing testing 123");
    } finally {
      await stopRecording?.();
    }
  });

  test("I can capture live region screen reader output from Playwright commands", async ({
    browser,
    browserName,
    page,
    screenReader,
  }) => {
    const osName = platform();
    const osVersion = release();
    const browserVersion = browser.version();
    const screenReaderName = screenReader.name;
    const screenReaderVersion = screenReader.version;
    const { retry } = test.info();
    const recordingFilePath = `./recordings/playwright-screenreader-live-region-capture-${osName}-${osVersion}-${browserName}-${browserVersion}-attempt-${retry}-${+new Date()}.mov`;

    console.table({
      osName,
      osVersion,
      browserName,
      browserVersion,
      screenReaderName,
      screenReaderVersion,
      retry,
    });

    let stopRecording: (() => Promise<void>) | undefined;

    try {
      stopRecording = await record(recordingFilePath);

      log("Navigating to live region test page.");

      await page.goto("about:blank", {
        waitUntil: "load",
      });

      // NOTE: Orca does not support `role="alert"` etc.correctly.
      // Authors are required to implement `aria-live` explicitly.
      await page.setContent(`
<!doctype html>
<html>
  <head>
    <title>Guidepup Live Region Test</title>
  </head>
  <body>
    <main>
      <h1>Example 1</h1>
      <button id="trigger">Update</button>
    </main>

    <div aria-live="assertive" role="alert" id="live"></div>

    <script>
      document.querySelector("#trigger").addEventListener("click", () => {
        document.querySelector("#live").textContent = "testing testing 123"
      });
    </script>
  </body>
</html>
    `);

      const button = page.locator("#trigger");
      await button.waitFor();
      await delay(500);

      await screenReader.navigateToWebContent();
      await delay(500);

      log(`Performing capture: Playwright focus`);
      const { spokenPhrase: focusSpokenPhrase } = await screenReader.capture(
        () => button.focus(),
      );
      log(`Screen reader output: "${focusSpokenPhrase}".`);

      await delay(500);

      log(`Performing capture: Playwright click`);
      const { spokenPhrase: clickSpokenPhrase } = await screenReader.capture(
        () => button.click(),
        {
          // Capture full output as there is potential for multiple phrases:
          //
          // 1. The button itself
          // 2. And the live region announcement
          //
          // And the default capture of "initial" will cut off the announcement.
          capture: true,
        },
      );
      log(`Screen reader output: "${clickSpokenPhrase}".`);

      // TODO: support capture from Playwright interactions.
      expect(clickSpokenPhrase).toContain("testing testing 123");
    } finally {
      await stopRecording?.();
    }
  });
});
