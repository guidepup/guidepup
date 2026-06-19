import { platform, release } from "os";
import { delay } from "../delay";
import { expect } from "@playwright/test";
import { headerNavigation } from "../headerNavigation";
import { log } from "../../../log";
import { logIncludesExpectedPhrases } from "../../../logIncludesExpectedPhrases";
import spokenPhraseSnapshotGitHub from "./chromium.spokenPhrase.github.snapshot.json";
import spokenPhraseSnapshotTextarea from "./chromium.spokenPhrase.textarea.snapshot.json";
import { nvdaTest as test } from "../../nvda-test";

const record = async (filepath: string) => {
  try {
    const { windowsRecord } = await import("@guidepup/record");

    return windowsRecord(filepath);
  } catch {
    console.warn(
      "@guidepup/record not available. Recording will be skipped. This is expected on platforms without ffmpeg support (e.g., Windows ARM64).",
    );
  }
};

test.describe("Chromium Playwright NVDA", () => {
  test("I can navigate the Guidepup Github page", async ({
    browser,
    browserName,
    page,
    nvda,
  }) => {
    const osName = platform();
    const osVersion = release();
    const browserVersion = browser.version();
    const { retry } = test.info();
    const recordingFilePath = `./recordings/playwright-nvda-${osName}-${osVersion}-${browserName}-${browserVersion}-attempt-${retry}-${+new Date()}.mov`;

    console.table({
      osName,
      osVersion,
      browserName,
      browserVersion,
      retry,
    });

    let stopRecording: (() => void) | undefined;

    try {
      stopRecording = await record(recordingFilePath);

      await headerNavigation({ page, nvda });

      // Assert that we've ended up where we expected and what we were told on
      // the way there is as expected.

      const spokenPhraseLog = await nvda.spokenPhraseLog();

      console.log(JSON.stringify(spokenPhraseLog, undefined, 2));

      logIncludesExpectedPhrases(spokenPhraseLog, spokenPhraseSnapshotGitHub);
    } finally {
      stopRecording?.();
    }
  });

  test("I can type text into text areas and it is announced (https://github.com/guidepup/guidepup/issues/115)", async ({
    browser,
    browserName,
    page,
    nvda,
  }) => {
    const osName = platform();
    const osVersion = release();
    const browserVersion = browser.version();
    const { retry } = test.info();
    const recordingFilePath = `./recordings/playwright-nvda-textarea-${osName}-${osVersion}-${browserName}-${browserVersion}-attempt-${retry}-${+new Date()}.mov`;

    console.table({
      osName,
      osVersion,
      browserName,
      browserVersion,
      retry,
    });

    let stopRecording: (() => void) | undefined;

    try {
      stopRecording = await record(recordingFilePath);

      log("Navigating to textarea test page.");
      await page.goto("about:blank", {
        waitUntil: "load",
      });

      await page.setContent(`
        <label for="test">Test Input</label>
        <input id="test" />
      `);

      const input = page.locator("#test");
      await input.waitFor();
      await delay(500);

      await nvda.navigateToWebContent();
      await delay(500);

      await nvda.type("Abc");
      await nvda.press("Control+A");
      await nvda.press("Delete");
      await nvda.type("123");

      await expect(input).toHaveValue("123");

      const spokenPhraseLog = await nvda.spokenPhraseLog();

      console.log(JSON.stringify(spokenPhraseLog, undefined, 2));

      logIncludesExpectedPhrases(spokenPhraseLog, spokenPhraseSnapshotTextarea);
    } finally {
      stopRecording?.();
    }
  });
});
