import { expect } from "@playwright/test";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function headerNavigation({ page, nvda }) {
  // Navigate to Guidepup GitHub page 🎉
  await page.goto("https://github.com/guidepup/guidepup", {
    waitUntil: "domcontentloaded",
  });

  // Wait for page to be ready and interact 🙌
  await expect(page.locator('header[role="banner"]')).toBeVisible();
  await delay(500);

  await nvda.act();

  // Move across the page menu to the Guidepup heading using VoiceOver 🔎
  while ((await nvda.lastSpokenPhrase()) !== "heading, level 1, Guidepup") {
    await nvda.next();
  }
}
