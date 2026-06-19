import { delay } from "./delay";
import { log } from "../../log";
import { NVDAPlaywright } from "../nvda-test";
import { Page } from "@playwright/test";

const MAX_NAVIGATION_LOOP = 10;

export async function headerNavigation({
  page,
  nvda,
}: {
  page: Page;
  nvda: NVDAPlaywright;
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
  await nvda.navigateToWebContent();
  await delay(500);

  let headingCount = 0;

  // Move across the headings using VoiceOver 🔎
  while (
    !(await nvda.lastSpokenPhrase()).includes("Framework Agnostic") &&
    headingCount <= MAX_NAVIGATION_LOOP
  ) {
    headingCount++;

    log(`Performing command: "H"`);
    await nvda.perform(nvda.keyboardCommands.moveToNextHeading);
    log(`Screen reader output: "${await nvda.lastSpokenPhrase()}".`);
  }

  let tabCount = 0;

  // Move across text and buttons using NVDA
  while (
    !(await nvda.lastSpokenPhrase()).replaceAll(/\s*/, "").includes("GitHub") &&
    tabCount <= MAX_NAVIGATION_LOOP
  ) {
    tabCount++;

    log(`Performing command: "Right"`);
    await nvda.next();
    log(`Screen reader output: "${await nvda.lastSpokenPhrase()}".`);
  }

  log(`Performing command: "Left"`);
  await nvda.previous();
  log(`Screen reader output: "${await nvda.lastSpokenPhrase()}".`);

  log(`Performing command: "Enter"`);
  await nvda.act();
  log(`Screen reader output: "${await nvda.lastSpokenPhrase()}".`);
}
