import { platform, release } from "os";
import { headerNavigation } from "../headerNavigation";
import itemTextSnapshot from "./chromium.itemText.snapshot.json";
import { logIncludesExpectedPhrases } from "../../../logIncludesExpectedPhrases";
import { macOSRecord } from "../../../../lib";
import spokenPhraseSnapshot from "./chromium.spokenPhrase.snapshot.json";
import { voTest as test } from "../../voiceover-test";

test.describe("Chromium Playwright VoiceOver", () => {
  test("I can navigate the Guidepup Github page", async ({
    browserName,
    page,
    voiceOver,
  }) => {
    let stopRecording;

    try {
      const { retry } = test.info();

      stopRecording = macOSRecord(
        `./recordings/playwright-voiceover-firefox-${platform()}-${release()}-attempt-${retry}-${+new Date()}.mov`
      );

      await headerNavigation({ browserName, page, voiceOver });

      // Assert that we've ended up where we expected and what we were told on
      // the way there is as expected.

      const itemTextLog = await voiceOver.itemTextLog();
      const spokenPhraseLog = await voiceOver.spokenPhraseLog();

      console.log(JSON.stringify(itemTextLog, undefined, 2));
      console.log(JSON.stringify(spokenPhraseLog, undefined, 2));

      logIncludesExpectedPhrases(itemTextLog, itemTextSnapshot);
      logIncludesExpectedPhrases(spokenPhraseLog, spokenPhraseSnapshot);
    } finally {
      stopRecording();
    }
  });
});
