import { expect } from "@playwright/test";
import { headerNavigation } from "../headerNavigation";
import spokenPhraseSnapshot from "./chromium.spokenPhrase.snapshot.json";
import { voTest as test } from "../../nvda-test";

test.describe("Chromium Playwright NVDA", () => {
  test("I can navigate the Guidepup Github page", async ({ page, nvda }) => {
    await headerNavigation({ page, nvda });

    // Assert that we've ended up where we expected and what we were told on
    // the way there is as expected.

    const spokenPhraseLog = await nvda.spokenPhraseLog();

    console.log(JSON.stringify(spokenPhraseLog, undefined, 2));

    for (const expectedPhrase of spokenPhraseSnapshot) {
      expect(
        !!spokenPhraseLog.find((log) => log.includes(expectedPhrase))
      ).toBe(true);
    }
  });
});