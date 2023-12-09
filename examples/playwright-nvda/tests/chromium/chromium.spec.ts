import { platform, release } from "os";
import { headerNavigation } from "../headerNavigation";
import { logIncludesExpectedPhrases } from "../../../logIncludesExpectedPhrases";
import spokenPhraseSnapshot from "./chromium.spokenPhrase.snapshot.json";
import { nvdaTest as test } from "../../nvda-test";
import { windowsRecord } from "../../../../lib";

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
    const recordingFilePath = `./recordings/playwright-nvda-${osName}-${osVersion}-${browserName}-${browserVersion.replace(
      /\./g,
      "_"
    )}-attempt-${retry}-${+new Date()}.mov`;

    console.table({
      osName,
      osVersion,
      browserName,
      browserVersion,
      retry,
      recordingFilePath,
    });

    let stopRecording;

    try {
      stopRecording = windowsRecord(recordingFilePath);

      await headerNavigation({ browserName, page, nvda });

      // Assert that we've ended up where we expected and what we were told on
      // the way there is as expected.

      const spokenPhraseLog = await nvda.spokenPhraseLog();

      console.log(JSON.stringify(spokenPhraseLog, undefined, 2));

      logIncludesExpectedPhrases(spokenPhraseLog, spokenPhraseSnapshot);
    } finally {
      stopRecording();
    }
  });
});
