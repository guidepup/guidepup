import { platform, release } from "os";
import { headerNavigation } from "../headerNavigation";
import { logIncludesExpectedPhrases } from "../../../logIncludesExpectedPhrases";
import spokenPhraseSnapshot from "./firefox.spokenPhrase.snapshot.json";
import { nvdaTest as test } from "../../nvda-test";

const record = async (filepath: string) => {
  try {
    const { windowsRecord } = await import("@guidepup/record");

    return windowsRecord(filepath);
  } catch {
    console.warn(
      "@guidepup/record not available",
      "Recording will be skipped. This is expected on platforms without ffmpeg support (e.g., Windows ARM64).",
    );
  }
};

test.describe("Firefox Playwright NVDA", () => {
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

      await headerNavigation({ browserName, page, nvda });

      // Assert that we've ended up where we expected and what we were told on
      // the way there is as expected.

      const spokenPhraseLog = await nvda.spokenPhraseLog();

      console.log(JSON.stringify(spokenPhraseLog, undefined, 2));

      logIncludesExpectedPhrases(spokenPhraseLog, spokenPhraseSnapshot);
    } finally {
      stopRecording?.();
    }
  });
});
