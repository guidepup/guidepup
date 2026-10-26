import { expect, type Page } from "@playwright/test";
import { delay } from "../../../src/delay";
import { log } from "../../log";
import type { NVDAPlaywright } from "../nvda-test";

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

  // Move across the headings using NVDA 🔎
  log(`Performing multiple commands: "H"`);
  await nvda.navigateNextHeadingUntil(/Framework Agnostic/);
  log(`Last screen reader output: "${await nvda.lastSpokenPhrase()}".`);

  // Move across text and buttons using NVDA
  log(`Performing multiple commands: "Right"`);
  await nvda.navigateNextUntil(/Git\s*Hub/);
  log(`Last screen reader output: "${await nvda.lastSpokenPhrase()}".`);

  log(`Performing command: "Left"`);
  await nvda.previous();
  log(`Last screen reader output: "${await nvda.lastSpokenPhrase()}".`);

  log(`Performing command: "Enter"`);
  await nvda.act();
  log(`Last screen reader output: "${await nvda.lastSpokenPhrase()}".`);

  await expect(page).toHaveURL("https://www.guidepup.dev/docs/getting-started");
}
