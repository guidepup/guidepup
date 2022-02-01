import { expect } from "@playwright/test";
import searchJourneyItemTextSnapshot from "./searchJourneyItemTextSnapshot.json";
import test from "./voiceover-test";
import { VoiceOver } from "../../../lib";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForWebContentAnnouncement(vo: VoiceOver) {
  for (let i = 0; i < 10; i++) {
    const itemText = await vo.caption.itemText();

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
    vo,
  }) => {
    await page.goto("https://playwright.dev/", {
      waitUntil: "domcontentloaded",
    });

    // Wait for page to be ready and interact.
    await expect(page.locator(".navbar__logo")).toBeVisible();
    await waitForWebContentAnnouncement(vo);
    await vo.cursor.interact();

    // Move across the navigation menu to the search bar.
    while (!(await vo.caption.lastSpokenPhrase())?.startsWith("Search")) {
      await vo.cursor.next();
    }

    // Search for Safari.
    // Comboboxes are fiddly to get right... 😅 Seems with the Playwright
    // website we need to do some arrow keying to get the required focus
    // on the desired option.
    await vo.keyboard.type("Safari");
    await vo.keyboard.press("ArrowDown");
    await vo.keyboard.press("ArrowUp");
    await Promise.all([page.waitForNavigation(), vo.cursor.act()]);
    expect(page.url()).toBe("https://playwright.dev/docs/browsers#webkit");

    // We're getting there, but seems don't get focus on the section we want!
    // We have to navigate to the Webkit section. We do this by navigating
    // by header.
    while ((await vo.caption.lastSpokenPhrase()) !== "Headings") {
      await vo.keyboard.perform(
        vo.keyboard.commands.cycleRightThroughNavigationSettings
      );
    }

    while ((await vo.caption.itemText()) !== "WebKit heading level 2") {
      await vo.keyboard.perform(vo.keyboard.commands.navigateDown);
    }

    // Assert that we've ended up where we expected and what we were told on
    // the way there is as expected.
    const itemTextLog = await vo.caption.itemTextLog();

    for (const expectedItem of searchJourneyItemTextSnapshot) {
      expect(itemTextLog).toContain(expectedItem);
    }
  });
});
