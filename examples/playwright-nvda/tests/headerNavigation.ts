import { nvda as _nvda } from "../../../lib";
import { log } from "../../log";
import { Page } from "@playwright/test";

type NVDA = typeof _nvda;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MAX_NAVIGATION_LOOP = 10;

export async function headerNavigation({
  browserName,
  page,
  nvda,
}: {
  browserName: string;
  page: Page;
  nvda: NVDA;
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

  if (browserName === "chromium") {
    // Get to the main page - sometimes focus can land on the address bar
    while (!(await nvda.lastSpokenPhrase()).includes("document")) {
      log(`Performing command: "F6"`);
      await nvda.press("F6");
      log(`Screen reader output: "${await nvda.lastSpokenPhrase()}".`);
    }
  } else if (browserName === "firefox") {
    // Force focus to somewhere in the web content
    await page.locator("a").first().focus();
  }

  // Make sure not in focus mode
  log(`Performing command: "Escape"`);
  await nvda.perform(nvda.keyboardCommands.exitFocusMode);
  log(`Screen reader output: "${await nvda.lastSpokenPhrase()}".`);

  let headingCount = 0;

  // Move across the page menu to the Guidepup heading using VoiceOver 🔎
  while (
    !(await nvda.lastSpokenPhrase()).includes("Guidepup, heading, level 1") &&
    headingCount <= MAX_NAVIGATION_LOOP
  ) {
    headingCount++;

    log(`Performing command: "H"`);
    await nvda.perform(nvda.keyboardCommands.moveToNextHeading);
    log(`Screen reader output: "${await nvda.lastSpokenPhrase()}".`);
  }

  let tabCount = 0;

  // Move through the README using standard keyboard commands
  while (
    !(await nvda.lastSpokenPhrase()).includes("NVDA on Windows") &&
    tabCount <= MAX_NAVIGATION_LOOP
  ) {
    tabCount++;

    log(`Performing command: "Tab"`);
    await nvda.press("Tab");
    log(`Screen reader output: "${await nvda.lastSpokenPhrase()}".`);
  }

  log(`Performing command: "Shift+Tab"`);
  await nvda.press("Shift+Tab");
  log(`Screen reader output: "${await nvda.lastSpokenPhrase()}".`);

  log(`Performing command: "Enter"`);
  await nvda.act();
  log(`Screen reader output: "${await nvda.lastSpokenPhrase()}".`);
}
