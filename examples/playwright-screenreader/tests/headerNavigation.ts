import { delay } from "./delay";
import { log } from "../../log";
import { Page } from "@playwright/test";
import { ScreenReaderPlaywright } from "../screenreader-test";

const MAX_NAVIGATION_LOOP = 10;

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

  let navigationCount = 0;

  // Move across the content
  while (
    !(await screenReader.itemText()).replaceAll(/\s/g, "").includes("GitHub") &&
    navigationCount <= MAX_NAVIGATION_LOOP
  ) {
    navigationCount++;

    log(`Performing command: next`);
    await screenReader.next();
    log(`Screen reader output: "${await screenReader.lastSpokenPhrase()}".`);
  }

  log(`Performing command: act`);
  await screenReader.act();
  log(`Screen reader output: "${await screenReader.lastSpokenPhrase()}".`);
}
