import { platform, release } from "os";
import { headerNavigation } from "../headerNavigation";
import itemTextSnapshot from "./chromium.itemText.snapshot.json";
import { logIncludesExpectedPhrases } from "../../../logIncludesExpectedPhrases";
import { macOSRecord } from "../../../../lib";
import spokenPhraseSnapshot from "./chromium.spokenPhrase.snapshot.json";
import { voTest as test } from "../../voiceover-test";

test.describe("Chromium Playwright VoiceOver", () => {
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
      const isMacOSVentura =
        osName === "darwin" && osVersion.split(".")[0] === "22";

      if (!isMacOSVentura) {
        stopRecording = macOSRecord(recordingFilePath);
      }

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
      stopRecording?.();
    }
  });
});
