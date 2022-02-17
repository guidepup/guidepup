import { expect } from "@playwright/test";
import searchJourneyItemTextSnapshot from "./searchJourneyItemTextSnapshot.json";
import test from "./voiceover-test";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForWebContentAnnouncement(voiceOver) {
  for (let i = 0; i < 10; i++) {
    const itemText = await voiceOver.itemText();

    if (itemText?.includes("web content")) {
      return;
    }

    await delay(50);
  }

  throw new Error("web content could not be found");
}

test.describe("Playwright VoiceOver", () => {
  test("I can navigate the Playwright website to the Safari section", async ({
    page,
    voiceOver,
  }) => {
    await page.goto("https://playwright.dev/", {
      waitUntil: "domcontentloaded",
    });

    // Wait for page to be ready and interact.
    await expect(page.locator(".navbar__logo")).toBeVisible();
    await waitForWebContentAnnouncement(voiceOver);
    await voiceOver.interact();

    // Navigate to the search bar.
    while (!(await voiceOver.lastSpokenPhrase())?.startsWith("Search")) {
      await voiceOver.perform(voiceOver.keyboard.commands.findNextControl);
    }

    // Search for Safari.
    // Comboboxes are fiddly to get right... 😅 Seems with the Playwright
    // website we need to do some arrow keying to get the required focus
    // on the desired option.
    await voiceOver.type("Safari");
    await voiceOver.press("ArrowDown");
    await voiceOver.press("ArrowUp");
    await Promise.all([page.waitForNavigation(), voiceOver.act()]);
    expect(page.url()).toBe("https://playwright.dev/docs/browsers#webkit");

    // Let's navigate the page to the WebKit section.
    while ((await voiceOver.itemText()) !== "WebKit heading level 2") {
      await voiceOver.perform(voiceOver.keyboard.commands.findNextHeading);
    }

    // Assert that we've ended up where we expected and what we were told on
    // the way there is as expected.
    const itemTextLog = await voiceOver.itemTextLog();

    for (const expectedItem of searchJourneyItemTextSnapshot) {
      expect(itemTextLog).toContain(expectedItem);
    }
  });
});
