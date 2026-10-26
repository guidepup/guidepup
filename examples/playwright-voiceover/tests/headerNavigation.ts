import { expect, type Page } from "@playwright/test";
import { delay } from "../../../src/delay";
import { log } from "../../log";
import type { VoiceOverPlaywright } from "../voiceover-test";

export async function headerNavigation({
  page,
  voiceOver,
}: {
  page: Page;
  voiceOver: VoiceOverPlaywright;
}) {
  // Navigate to Guidepup Website 🎉
  log("Navigating to URL: https://www.guidepup.dev.");
  await page.goto("https://www.guidepup.dev", {
    waitUntil: "load",
  });

  // Wait for page to be ready and interact 🙌
  const header = page.locator("h1");
  await header.waitFor();
  await delay(500);

  // Make sure interacting with the web content
  await voiceOver.navigateToWebContent();
  await delay(500);

  // Move across the headings using VoiceOver 🔎
  log(`Performing multiple commands: "VO+Command+H"`);
  await voiceOver.navigateNextHeadingUntil(/Framework Agnostic/);
  log(`Last screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

  // Move across text and buttons using VoiceOver
  log(`Performing multiple commands: "VO+Right Arrow"`);
  await voiceOver.navigateNextUntil(/GitHub/);
  log(`Last screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

  log(`Performing command: "VO+Left Arrow"`);
  await voiceOver.previous();
  log(`Last screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

  log(
    `Performing command: "VO+F3" - "Describe the item in the VoiceOver cursor"`,
  );
  await voiceOver.perform(voiceOver.keyboardCommands.describeItem);
  log(`Last screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

  // Navigate to the Guidepup Getting Started docs
  log(`Performing command: "VO+Space bar"`);
  await voiceOver.act();
  log(`Last screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

  await expect(page).toHaveURL("https://www.guidepup.dev/docs/getting-started");
}
