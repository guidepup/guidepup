import { platform, release } from "os";
import { headerNavigation } from "../headerNavigation";
import { logIncludesExpectedPhrases } from "../../../logIncludesExpectedPhrases";
import spokenPhraseSnapshot from "./firefox.spokenPhrase.snapshot.json";
import { nvdaTest as test } from "../../nvda-test";
import { windowsRecord } from "../../../../lib";

test.describe("Firefox Playwright NVDA", () => {
  test("I can navigate the Guidepup Github page", async ({
    browserName,
    page,
    nvda,
  }) => {
    let stopRecording;

    try {
      const { retry } = test.info();

      stopRecording = windowsRecord(
        `./recordings/playwright-nvda-chromium-${platform()}-${release()}-attempt-${retry}-${+new Date()}.mov`
      );

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
