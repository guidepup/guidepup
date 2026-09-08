import { expect, type Page } from "@playwright/test";
import { delay } from "../../../src/delay";
import { log } from "../../log";
import type { OrcaPlaywright } from "../orca-test";

const MAX_NAVIGATION_LOOP = 10;

export async function headerNavigation({
  page,
  orca,
}: {
  page: Page;
  orca: OrcaPlaywright;
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
  await orca.navigateToWebContent();
  await delay(500);

  let headingCount = 0;
  let lastSpokenPhrase = "";

  // Move across the headings using VoiceOver 🔎
  while (
    lastSpokenPhrase.includes("Framework Agnostic") &&
    headingCount <= MAX_NAVIGATION_LOOP
  ) {
    headingCount++;

    log(`Performing command: "H" - "Find the next heading"`);
    await orca.nextHeading();
    lastSpokenPhrase = await orca.lastSpokenPhrase();
    log(`Screen reader output: "${lastSpokenPhrase}".`);

    log(`Performing command: "Orca+Return" - "Where am I detailed"`);
    await orca.perform(orca.keyboardCommands.WhereAmIDetailed);
    log(`Screen reader output: "${await orca.lastSpokenPhrase()}".`);
  }

  let tabCount = 0;
  lastSpokenPhrase = "";

  // Move across text and buttons using Orca
  while (
    !lastSpokenPhrase.replaceAll(/\s/g, "").includes("GitHub") &&
    tabCount <= MAX_NAVIGATION_LOOP
  ) {
    tabCount++;

    log(`Performing command: "Orca+Ctrl+Right Arrow"`);
    await orca.next();
    lastSpokenPhrase = await orca.lastSpokenPhrase();
    log(`Screen reader output: "${lastSpokenPhrase}".`);

    log(`Performing command: "Orca+Return" - "Where am I detailed"`);
    await orca.perform(orca.keyboardCommands.WhereAmIDetailed);
    log(`Screen reader output: "${await orca.lastSpokenPhrase()}".`);
  }

  log(`Performing command: "Orca+Ctrl+Left Arrow"`);
  await orca.previous();
  log(`Screen reader output: "${await orca.lastSpokenPhrase()}".`);

  log(`Performing command: "Orca+Return" - "Where am I detailed"`);
  await orca.perform(orca.keyboardCommands.WhereAmIDetailed);
  log(`Screen reader output: "${await orca.lastSpokenPhrase()}".`);

  log(`Performing command: "Orca+Ctrl+Enter"`);
  await orca.act();
  log(`Screen reader output: "${await orca.lastSpokenPhrase()}".`);

  await expect(page).toHaveURL("https://www.guidepup.dev/docs/getting-started");
}
