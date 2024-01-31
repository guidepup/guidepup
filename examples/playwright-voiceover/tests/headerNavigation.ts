import { voiceOver as _voiceOver } from "../../../lib";
import { log } from "../../log";
import { Page } from "@playwright/test";

type VoiceOver = typeof _voiceOver;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MAX_NAVIGATION_LOOP = 10;

export async function headerNavigation({
  page,
  voiceOver,
}: {
  page: Page;
  voiceOver: VoiceOver;
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
  log(`Performing command: "VO+Shift+Down Arrow"`);
  await voiceOver.interact();
  log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

  // Prevent auto-navigation of group
  log(`Performing command: "VO+Shift+Left Arrow"`);
  await voiceOver.perform(voiceOver.keyboardCommands.jumpToLeftEdge);
  log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

  let headingCount = 0;

  // Move across the headings using VoiceOver 🔎
  while (
    !(await voiceOver.itemText()).includes("Framework Agnostic") &&
    headingCount <= MAX_NAVIGATION_LOOP
  ) {
    headingCount++;

    log(`Performing command: "VO+Command+H"`);
    await voiceOver.perform(voiceOver.keyboardCommands.findNextHeading);
    log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);
  }

  let tabCount = 0;

  // Move across text and buttons using VoiceOver
  while (
    !(await voiceOver.itemText()).includes("GitHub") &&
    tabCount <= MAX_NAVIGATION_LOOP
  ) {
    tabCount++;

    log(`Performing command: "VO+Right Arrow"`);
    await voiceOver.next();
    log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);
  }

  log(`Performing command: "VO+Left Arrow"`);
  await voiceOver.previous();
  log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

  // Navigate to the Guidepup Getting Started docs
  log(`Performing command: "VO+Space bar"`);
  await voiceOver.act();
  log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);

  // Prevent auto-navigation of group
  log(`Performing command: "VO+Shift+Left Arrow"`);
  await voiceOver.perform(voiceOver.keyboardCommands.jumpToLeftEdge);
  log(`Screen reader output: "${await voiceOver.lastSpokenPhrase()}".`);
}
