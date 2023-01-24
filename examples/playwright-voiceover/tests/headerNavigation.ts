import { expect } from "@playwright/test";

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function headerNavigation({ page, voiceOver }) {
  // Navigate to Guidepup GitHub page 🎉
  await page.goto("https://github.com/guidepup/guidepup", {
    waitUntil: "domcontentloaded",
  });

  // Wait for page to be ready and interact 🙌
  await expect(page.locator('header[role="banner"]')).toBeVisible();
  await delay(500);

  await voiceOver.interact();

  // Move across the page menu to the Guidepup heading using VoiceOver 🔎
  while ((await voiceOver.itemText()) !== "Guidepup heading level 1") {
    await voiceOver.perform(voiceOver.keyboard.commands.findNextHeading);
  }
}
