import { Page, PlaywrightWorkerOptions } from "@playwright/test";
import { voiceOver as _voiceOver } from "../../../lib";
import { log } from "../../log";

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
  log("Navigating to URL: https://github.com/guidepup/guidepup.");
  await page.goto("https://github.com/guidepup/guidepup", {
    waitUntil: "load",
  });

  // Wait for page to be ready and interact 🙌
  const header = page.locator('header[role="banner"]');
  await header.waitFor();
  await delay(500);

  // Make sure interacting with the web content
  log(`Performing command: "VO+Shift+Down Arrow"`);
  await voiceOver.interact();
  log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

  await page.locator("a").first().focus();

  log(`Performing command: "VO+Shift+F4"`);
  await voiceOver.perform(voiceOver.keyboardCommands.moveCursorToKeyboardFocus);
  log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

  // Prevent auto-navigation of group
  log(`Performing command: "VO+Shift+Left Arrow"`);
  await voiceOver.perform(voiceOver.keyboardCommands.jumpToLeftEdge);
  log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

  let headingCount = 0;

  // Move across the page menu to the Guidepup heading using VoiceOver 🔎
  while (
    (await voiceOver.itemText()) !== "Guidepup heading level 1" &&
    headingCount <= MAX_NAVIGATION_LOOP
  ) {
    headingCount++;

    log(`Performing command: "VO+Command+H"`);
    await voiceOver.perform(voiceOver.keyboardCommands.findNextHeading);
    log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);
  }

  let tabCount = 0;

  // Move through the README using standard keyboard commands
  while (
    !(await voiceOver.itemText()).includes("NVDA on Windows") &&
    tabCount <= MAX_NAVIGATION_LOOP
  ) {
    tabCount++;

    if (browserName === "webkit") {
      log(`Performing command: "Alt+Tab"`);
      await voiceOver.press("Alt+Tab");
      log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);
    } else {
      log(`Performing command: "Tab"`);
      await voiceOver.press("Tab");
      log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);
    }
  }

  if (browserName === "webkit") {
    log(`Performing command: "Shift+Alt+Tab"`);
    await voiceOver.press("Shift+Alt+Tab");
    log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);
  } else {
    log(`Performing command: "Shift+Tab"`);
    await voiceOver.press("Shift+Tab");
    log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);
  }

  // Navigate to the VoiceOver Guidepup docs
  log(`Performing command: "VO+Space bar"`);
  await voiceOver.act();
  log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

  // Prevent auto-navigation of group
  log(`Performing command: "VO+Shift+Left Arrow"`);
  await voiceOver.perform(voiceOver.keyboardCommands.jumpToLeftEdge);
  log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);
}
