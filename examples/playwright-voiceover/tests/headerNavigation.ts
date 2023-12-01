import { Page, PlaywrightWorkerOptions } from "@playwright/test";
import { voiceOver as _voiceOver } from "../../../lib";

type VoiceOver = typeof _voiceOver;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MAX_NAVIGATION_LOOP = 10;

export async function headerNavigation({
  browserName,
  page,
  voiceOver,
}: {
  browserName: PlaywrightWorkerOptions["browserName"];
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

  let headingCount = 0;

  // Move across the page menu to the Guidepup heading using VoiceOver 🔎
  while (
    (await voiceOver.itemText()) !== "Guidepup heading level 1" &&
    headingCount <= MAX_NAVIGATION_LOOP
  ) {
    headingCount++;
    await voiceOver.perform(voiceOver.keyboardCommands.findNextHeading);
  }

  let tabCount = 0;

  // Move through the README using standard keyboard commands
  while (
    !(await voiceOver.itemText()).includes("NVDA on Windows") &&
    tabCount <= MAX_NAVIGATION_LOOP
  ) {
    tabCount++;

    if (browserName === "webkit") {
      await voiceOver.press("Alt+Tab");
    } else {
      await voiceOver.press("Tab");
    }
  }

  if (browserName === "webkit") {
    await voiceOver.press("Shift+Alt+Tab");
  } else {
    await voiceOver.press("Shift+Tab");
  }
  await voiceOver.act();
}
