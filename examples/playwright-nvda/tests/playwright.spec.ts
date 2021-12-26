import test from "./nvda-test";

test.describe("Playwright VoiceOver", () => {
  test("I can navigate the Playwright website(?)", async ({ page }) => {
    await page.goto("https://playwright.dev/", {
      waitUntil: "domcontentloaded",
    });
  });
});
