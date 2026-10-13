import { platform, release } from "os";
import { delay } from "../../../../src/delay";
import { log } from "../../../log";
import { logIncludesExpectedPhrases } from "../../../logIncludesExpectedPhrases";
import spokenPhraseSnapshot from "./firefox.spokenPhrase.snapshot.json";
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

test.describe("Firefox Playwright Screen Reader", () => {
  test("I can navigate the Guidepup Github page", async ({
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
    const recordingFilePath = `./recordings/playwright-screenreader-${osName}-${osVersion}-${browserName}-${browserVersion}-attempt-${retry}-${+new Date()}.mov`;

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

      log("Navigating to URL: https://www.guidepup.dev.");
      await page.goto("https://www.guidepup.dev", {
        waitUntil: "load",
      });

      const header = page.locator("h1");
      await header.waitFor();
      await delay(500);

      await screenReader.navigateToWebContent();
      await delay(500);

      // Navigate out of the skip to main content and into the navigation bar
      await screenReader.stopInteracting();
      await screenReader.next();
      await screenReader.interact();

      let navigationCount = 0;

      // Move across the header content
      while (
        !(await screenReader.itemText())
          .replaceAll(/\s/g, "")
          .includes("GitHub") &&
        navigationCount <= MAX_NAVIGATION_LOOP
      ) {
        navigationCount++;

        log(`Performing command: next`);
        await screenReader.next();
        log(
          `Screen reader output: "${await screenReader.lastSpokenPhrase()}".`,
        );
      }

      log(`Performing command: act`);
      await screenReader.act();
      log(`Screen reader output: "${await screenReader.lastSpokenPhrase()}".`);

      // Assert that we've ended up where we expected and what we were told on
      // the way there is as expected.

      const itemTextLog = await screenReader.itemTextLog();
      const spokenPhraseLog = await screenReader.spokenPhraseLog();

      console.log(JSON.stringify(itemTextLog, undefined, 2));
      console.log(JSON.stringify(spokenPhraseLog, undefined, 2));

      logIncludesExpectedPhrases(spokenPhraseLog, spokenPhraseSnapshot);
    } finally {
      await stopRecording?.();
    }
  });
});
