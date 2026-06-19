import { platform, release } from "os";
import { delay } from "../delay";
import { expect } from "@playwright/test";
import { headerNavigation } from "../headerNavigation";
import itemTextSnapshotDocs from "./webkit.itemText.docs.snapshot.json";
import { log } from "../../../log";
import { logIncludesExpectedPhrases } from "../../../logIncludesExpectedPhrases";
import spokenPhraseSnapshotDocs from "./webkit.spokenPhrase.docs.snapshot.json";
import spokenPhraseSnapshotTextarea from "./webkit.spokenPhrase.textarea.snapshot.json";
import { voTest as test } from "../../voiceover-test";

const record = async (filepath: string) => {
  try {
    const { macOSRecord } = await import("@guidepup/record");

    return macOSRecord(filepath);
  } catch {
    console.warn(
      "@guidepup/record not available. Recording will be skipped. This is expected on platforms without ffmpeg support (e.g., Windows ARM64).",
    );
  }
};

test.describe("Webkit Playwright VoiceOver", () => {
  test("I can navigate the Guidepup Github page", async ({
    browser,
    browserName,
    page,
    voiceOver,
  }) => {
    const osName = platform();
    const osVersion = release();
    const browserVersion = browser.version();
    const { retry } = test.info();
    const recordingFilePath = `./recordings/playwright-voiceover-${osName}-${osVersion}-${browserName}-${browserVersion}-attempt-${retry}-${+new Date()}.mov`;

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

      await headerNavigation({ page, voiceOver });

      // Assert that we've ended up where we expected and what we were told on
      // the way there is as expected.

      const itemTextLog = await voiceOver.itemTextLog();
      const spokenPhraseLog = await voiceOver.spokenPhraseLog();

      console.log(JSON.stringify(itemTextLog, undefined, 2));
      console.log(JSON.stringify(spokenPhraseLog, undefined, 2));

      logIncludesExpectedPhrases(itemTextLog, itemTextSnapshotDocs);
      logIncludesExpectedPhrases(spokenPhraseLog, spokenPhraseSnapshotDocs);
    } finally {
      stopRecording?.();
    }
  });

  test("I can type text into text areas and it is announced (https://github.com/guidepup/guidepup/issues/115)", async ({
    browser,
    browserName,
    page,
    voiceOver,
  }) => {
    const osName = platform();
    const osVersion = release();
    const browserVersion = browser.version();
    const { retry } = test.info();
    const recordingFilePath = `./recordings/playwright-voiceOver-textarea-${osName}-${osVersion}-${browserName}-${browserVersion}-attempt-${retry}-${+new Date()}.mov`;

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

      await voiceOver.navigateToWebContent();
      await delay(500);

      log(`Performing command: "VO+Right Arrow"`);
      await voiceOver.next();
      log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

      log(`Typing: "Abc"`);
      await voiceOver.type("Abc");
      log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

      log(`Pressing: "Cmd+A"`);
      await voiceOver.press("Cmd+A");
      log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

      log(`Pressing: "Delete"`);
      await voiceOver.press("Delete");
      log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

      log(`Pressing: "Delete"`);
      await voiceOver.type("123");
      log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

      await expect(input).toHaveValue("123");

      const spokenPhraseLog = await voiceOver.spokenPhraseLog();

      console.log(JSON.stringify(spokenPhraseLog, undefined, 2));

      logIncludesExpectedPhrases(spokenPhraseLog, spokenPhraseSnapshotTextarea);
    } finally {
      stopRecording?.();
    }
  });
});
