import { expect } from "@playwright/test";
import itemTextSnapshot from "./itemText.snapshot.json";
import { macOSRecord } from "../../../lib";
import spokenPhraseSnapshot from "./spokenPhrase.snapshot.json";
import test from "./voiceover-test";

test.describe("Playwright VoiceOver", () => {
  test("I can navigate the Guidepup Github page", async ({
    page,
    voiceOver,
  }) => {
    const stopRecording = macOSRecord(
      `./recordings/playwright-voiceover-${+new Date()}.mov`
    );

    // Navigate to Guidepup GitHub page 🎉
    await page.goto("https://github.com/guidepup/guidepup", {
      waitUntil: "domcontentloaded",
    });

    // Wait for page to be ready and interact 🙌
    await expect(page.locator('header[role="banner"]')).toBeVisible();
    await voiceOver.interact();

    // Move across the page menu to the Guidepup heading using VoiceOver 🔎
    while ((await voiceOver.itemText()) !== "Guidepup heading level 1") {
      await voiceOver.perform(voiceOver.keyboard.commands.findNextHeading);
    }

    // Assert that we've ended up where we expected and what we were told on
    // the way there is as expected.

    const itemTextLog = await voiceOver.itemTextLog();
    const spokenPhraseLog = await voiceOver.spokenPhraseLog();

    console.table({ itemTextLog, itemTextSnapshot });
    console.table({ spokenPhraseLog, spokenPhraseSnapshot });

    for (const expectedItem of itemTextSnapshot) {
      expect(!!itemTextLog.find((log) => log.includes(expectedItem))).toBe(
        true
      );
    }

    for (const expectedPhrase of spokenPhraseSnapshot) {
      expect(
        !!spokenPhraseLog.find((log) => log.includes(expectedPhrase))
      ).toBe(true);
    }

    stopRecording();
  });
});
