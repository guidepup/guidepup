import { headerNavigation } from "../headerNavigation";
import itemTextSnapshot from "./webkit.itemText.snapshot.json";
import { logIncludesExpectedPhrases } from "../../../logIncludesExpectedPhrases";
import { macOSRecord } from "../../../../lib";
import spokenPhraseSnapshot from "./webkit.spokenPhrase.snapshot.json";
import { voTest as test } from "../../voiceover-test";

test.describe("Webkit Playwright VoiceOver", () => {
  test("I can navigate the Guidepup Github page", async ({
    page,
    voiceOver,
  }) => {
    const stopRecording = macOSRecord(
      `./recordings/playwright-voiceover-webkit-${+new Date()}.mov`
    );

    await headerNavigation({ page, voiceOver });

    // Assert that we've ended up where we expected and what we were told on
    // the way there is as expected.

    const itemTextLog = await voiceOver.itemTextLog();
    const spokenPhraseLog = await voiceOver.spokenPhraseLog();

    console.log(JSON.stringify(itemTextLog, undefined, 2));
    console.log(JSON.stringify(spokenPhraseLog, undefined, 2));

    logIncludesExpectedPhrases(itemTextLog, itemTextSnapshot);
    logIncludesExpectedPhrases(spokenPhraseLog, spokenPhraseSnapshot);

    stopRecording();
  });
});
