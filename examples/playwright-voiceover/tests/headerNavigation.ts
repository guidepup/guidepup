import { voiceOver as _voiceOver } from "../../../lib";
import { Page } from "@playwright/test";

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
  const header = page.locator('header[role="banner"]');
  await header.waitFor();
  await delay(500);

  // Make sure interacting with the web content
  await voiceOver.interact();

  // Move across the page menu to the Guidepup heading using VoiceOver 🔎
  while ((await voiceOver.itemText()) !== "Guidepup heading level 1") {
    await voiceOver.perform(voiceOver.keyboardCommands.findNextHeading);
  }
}
