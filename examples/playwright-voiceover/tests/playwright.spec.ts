import { expect } from "@playwright/test";
import test from "./voiceover-test";
import searchJourneyItemTextSnapshot from "./searchJourneyItemTextSnapshot.json";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test.describe("Playwright VoiceOver", () => {
  test("I can navigate the Playwright website to the Safari section", async ({
    page,
    vo,
  }) => {
    await page.goto("https://playwright.dev/", {
      waitUntil: "domcontentloaded",
    });

    // Wait for page to be ready and interact
    await expect(page.locator(".navbar__logo")).toBeVisible();

    while (
      (await vo.getLastSpokenPhrase())?.includes("Playwright web content")
    ) {
      await delay(250);
      await vo.commandInteractWithItem();
    }

    // Move across the navigation menu to the search bar
    while (!(await vo.getLastSpokenPhrase())?.startsWith("Search")) {
      await vo.moveNext();
    }

    // Search for Safari
    await page.keyboard.type("Safari");
    await Promise.all([page.waitForNavigation(), vo.performAction()]);
    expect(page.url()).toBe("https://playwright.dev/docs/browsers#webkit");

    // We're getting there, but seems don't get focus on the section we want!
    // We have to navigate to the Webkit section. We do this by navigating
    // by header.
    while ((await vo.getLastSpokenPhrase()) !== "Headings") {
      await vo.commandCycleRightThroughNavigationSettings();
    }

    while ((await vo.getItemText()) !== "WebKit heading level 2") {
      await vo.commandNavigateDown();
    }

    // Assert that we've ended up where we expected and what we were told on
    // the way there is as expected.
    const itemTextLog = await vo.getItemTextLog();

    for (const expectedItem of searchJourneyItemTextSnapshot) {
      expect(itemTextLog).toContain(expectedItem);
    }
  });
});
