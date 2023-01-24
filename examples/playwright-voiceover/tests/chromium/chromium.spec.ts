import { expect } from "@playwright/test";
import { headerNavigation } from "../headerNavigation";
import itemTextSnapshot from "./chromium.itemText.snapshot.json";
import { macOSRecord } from "../../../../lib";
import spokenPhraseSnapshot from "./chromium.spokenPhrase.snapshot.json";
import { voTest as test } from "../../voiceover-test";

test.describe("Chromium Playwright VoiceOver", () => {
  test("I can navigate the Guidepup Github page", async ({
    page,
    voiceOver,
  }) => {
    const stopRecording = macOSRecord(
      `./recordings/playwright-voiceover-chromium-${+new Date()}.mov`
    );

    await headerNavigation({ page, voiceOver });

    // Assert that we've ended up where we expected and what we were told on
    // the way there is as expected.

    const itemTextLog = await voiceOver.itemTextLog();
    const spokenPhraseLog = await voiceOver.spokenPhraseLog();

    for (const expectedItem of itemTextSnapshot) {
      expect(itemTextLog).toContain(expectedItem);
    }

    for (const expectedPhrase of spokenPhraseSnapshot) {
      expect(spokenPhraseLog).toContain(expectedPhrase);
    }

    stopRecording();
  });
});
