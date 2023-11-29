import { nvda as _nvda } from "../../../lib";
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
  await page.goto("https://github.com/guidepup/guidepup", {
    waitUntil: "domcontentloaded",
  });

  // Wait for page to be ready and interact 🙌
  const header = page.locator('header[role="banner"]');
  await header.waitFor();
  await delay(500);

  if (browserName === "chromium") {
    // Get to the main page - sometimes focus can land on the address bar
    while (!(await nvda.lastSpokenPhrase()).includes("document")) {
      await nvda.press("F6");
    }
  } else if (browserName === "firefox") {
    // Force focus to somewhere in the web content
    await page.locator("a").first().focus();
  }

  // Make sure not in focus mode
  await nvda.perform(nvda.keyboardCommands.exitFocusMode);

  let headingCount = 0;

  // Move across the page menu to the Guidepup heading using VoiceOver 🔎
  while (
    !(await nvda.lastSpokenPhrase()).includes("Guidepup, heading, level 1") ||
    headingCount === MAX_NAVIGATION_LOOP
  ) {
    headingCount++;
    await nvda.perform(nvda.keyboardCommands.moveToNextHeading);
  }

  let tabCount = 0;

  // Move through the README using standard keyboard commands
  while (
    (await nvda.itemText()) !== "NVDA on Windows" ||
    tabCount === MAX_NAVIGATION_LOOP
  ) {
    tabCount++;
    await nvda.press("Tab");
  }
}
