import { expect, Page } from "@playwright/test";
import { voiceOver as _voiceOver } from "../../../lib";

type VoiceOver = typeof _voiceOver;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function headerNavigation({
  page,
  voiceOver,
}: {
  page: Page;
  voiceOver: VoiceOver;
}) {
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
    await voiceOver.perform(voiceOver.keyboardCommands.findNextHeading);
  }
}
