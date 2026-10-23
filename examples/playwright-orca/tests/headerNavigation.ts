import { expect, type Page } from "@playwright/test";
import { delay } from "../../../src/delay";
import { log } from "../../log";
import type { OrcaPlaywright } from "../orca-test";

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

  // Move across the headings using Orca 🔎
  log(`Performing multiple commands: "H"`);
  await orca.navigateNextHeadingUntil(/Framework Agnostic/);
  log(`Last screen reader output: "${await orca.lastSpokenPhrase()}".`);

  // Move across text and buttons using Orca
  log(`Performing multiple commands: "Orca+Ctrl+Right Arrow"`);
  await orca.navigateNextUntil(/Git\s*Hub/);
  log(`Last screen reader output: "${await orca.lastSpokenPhrase()}".`);

  log(`Performing command: "Orca+Ctrl+Left Arrow"`);
  await orca.previous();
  log(`Last screen reader output: "${await orca.lastSpokenPhrase()}".`);

  log(`Performing command: "Orca+Ctrl+Enter"`);
  await orca.act();
  log(`Last screen reader output: "${await orca.lastSpokenPhrase()}".`);

  await expect(page).toHaveURL("https://www.guidepup.dev/docs/getting-started");
}
