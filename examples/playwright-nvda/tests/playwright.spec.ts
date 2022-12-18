import { expect } from "@playwright/test";
import itemTextSnapshot from "./itemTextSnapshot.json";
import test from "./nvda-test";

test.describe("Playwright NVDA", () => {
  test("I can navigate the Guidepup Github page", async ({ page, nvda }) => {
    // Navigate to Guidepup GitHub page 🎉
    await page.goto("https://github.com/guidepup/guidepup", {
      waitUntil: "domcontentloaded",
    });

    // Wait for page to be ready and interact 🙌
    await expect(page.locator('header[role="banner"]')).toBeVisible();
    await nvda.act();

    // Move across the page menu to the Guidepup heading using VoiceOver 🔎
    while ((await nvda.lastSpokenPhrase()) !== "heading, level 1, Guidepup") {
      await nvda.next();
    }

    // Assert that we've ended up where we expected and what we were told on
    // the way there is as expected.
    const spokenPhraseLog = await nvda.spokenPhraseLog();

    for (const expectedItem of itemTextSnapshot) {
      expect(
        spokenPhraseLog.find((log) => log.includes(expectedItem))
      ).toBeTruthy();
    }
  });
});
