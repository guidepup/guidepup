import { expect, Page } from "@playwright/test";
import { nvda as _nvda } from "../../../lib";

type NVDA = typeof _nvda;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  await expect(page.locator('header[role="banner"]')).toBeVisible();

  await delay(1000);

  if (browserName === "chromium") {
    // Get to the main page - sometimes focus can land on the address bar
    while (!(await nvda.lastSpokenPhrase()).includes("document")) {
      console.log(await nvda.lastSpokenPhrase());

      await nvda.press("F6");
    }
  } else if (browserName === "firefox") {
    // Force focus to somewhere in the web content
    await page.locator("a").first().focus();
  }

  // Make sure not in focus mode
  await nvda.perform(nvda.keyboardCommands.exitFocusMode);

  // Move across the page menu to the Guidepup heading using VoiceOver 🔎
  while (
    !(await nvda.lastSpokenPhrase()).includes("Guidepup, heading, level 1")
  ) {
    console.log(await nvda.lastSpokenPhrase());

    await nvda.perform(nvda.keyboardCommands.moveToNextHeading);
  }
}
