import { platform, release } from "os";
import { headerNavigation } from "../headerNavigation";
import { logIncludesExpectedPhrases } from "../../../logIncludesExpectedPhrases";
import spokenPhraseSnapshot from "./chromium.spokenPhrase.snapshot.json";
import { screenReaderTest as test } from "../../screenreader-test";

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

test.describe("Chromium Playwright Screen Reader", () => {
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

      await headerNavigation({ page, screenReader });

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
