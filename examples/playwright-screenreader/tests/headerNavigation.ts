import { delay } from "../../../src/delay";
import { log } from "../../log";
import type { Page } from "@playwright/test";
import type { ScreenReaderPlaywright } from "../screenreader-test";

export async function headerNavigation({
  page,
  screenReader,
}: {
  page: Page;
  screenReader: ScreenReaderPlaywright;
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
  await screenReader.navigateToWebContent();
  await delay(500);

  // Move across the content
  log(`Performing multiple commands: "next"`);
  await screenReader.navigateNextUntil(/Git\s*Hub/);
  log(`Last screen reader output: "${await screenReader.lastSpokenPhrase()}".`);

  log(`Performing command: act`);
  await screenReader.act();
  log(`Last screen reader output: "${await screenReader.lastSpokenPhrase()}".`);
}
