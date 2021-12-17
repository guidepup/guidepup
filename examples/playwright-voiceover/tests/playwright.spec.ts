import { expect } from "@playwright/test";
import { PLAYWRIGHT_APPLICATION } from "./constants";
import test from "./voiceover-test";

test.describe("Playwright VoiceOver", () => {
  test("I can navigate the Playwright website(?)", async ({ page, vo }) => {
    await page.goto("https://playwright.dev/", {
      waitUntil: "domcontentloaded",
    });

    // Interact with the page
    await vo.gestureInteractWithItem();

    // Move across the navigation menu to the search bar
    for (let i = 0; i < 10; i++) {
      await vo.moveRight();
    }

    // Search for Safari
    await vo.activate(PLAYWRIGHT_APPLICATION);
    await page.bringToFront();
    await page.keyboard.type("Safari");

    // Interact with the search listbox. Not the easiest to interact with!
    // Wonder if it could have a move accessible design?! 🤔
    await vo.moveRight();
    await vo.gestureInteractWithItem();
    await vo.activate(PLAYWRIGHT_APPLICATION);
    await page.keyboard.press("Enter");

    expect(page.url()).toBe("https://playwright.dev/docs/browsers#webkit");

    // We're getting there, but seems don't get focus on the section we want!
    // We have to navigate to the Webkit section.
    await vo.gestureNavigateDown();
    await vo.gestureNavigateDown();
    await vo.gestureNavigateDown();
    await vo.gestureNavigateDown();

    expect(await vo.getText()).toBe("WebKit heading level 2");
  });
});
