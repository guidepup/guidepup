import { platform, release } from "os";
import { delay } from "../../../../src/delay";
import { expect } from "@playwright/test";
import { log } from "../../../log";
import { screenReaderTest as test } from "../../screenreader-test";

test.describe("Chromium Playwright Screen Reader", () => {
  test("I can capture screen reader output from Playwright commands", async ({
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

    console.table({
      osName,
      osVersion,
      browserName,
      browserVersion,
      screenReaderName,
      screenReaderVersion,
      retry,
    });

    log("Navigating to live region test page.");

    await page.goto("about:blank", {
      waitUntil: "load",
    });

    await page.setContent(`
      <main>
        <h1>Example 1</h1>
        <button id="trigger">Update</button>
      </main>

      <div role="alert" id="live"></div>

      <script>
        document.querySelector("#trigger").addEventListener("click", () => {
          document.querySelector("#live").textContent = "testing testing 123"
        });
      </script>
    `);

    const button = page.locator("#trigger");
    await button.waitFor();
    await delay(500);

    await screenReader.navigateToWebContent();
    await delay(500);

    log(`Performing capture: Playwright focus`);
    const { spokenPhrase: focusSpokenPhrase } = await screenReader.capture(() =>
      button.focus(),
    );
    log(`Screen reader output: "${focusSpokenPhrase}".`);

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
  });
});
