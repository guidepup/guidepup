import { expect, Page } from "@playwright/test";
import { nvda as _nvda } from "../../../lib";

type NVDA = typeof _nvda;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function headerNavigation({
  page,
  nvda,
}: {
  page: Page;
  nvda: NVDA;
}) {
  // Navigate to Guidepup GitHub page 🎉
  await page.goto("https://github.com/guidepup/guidepup", {
    waitUntil: "domcontentloaded",
  });

  // Wait for page to be ready and interact 🙌
  await expect(page.locator('header[role="banner"]')).toBeVisible();
  await delay(500);

  await nvda.act();

  // Make sure not in focus mode
  await nvda.perform(nvda.keyboardCommands.exitFocusMode);

  // Move across the page menu to the Guidepup heading using VoiceOver 🔎
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const spokenPhraseLog = await nvda.spokenPhraseLog();

    if (
      spokenPhraseLog.find((log) => log.includes("Guidepup, heading, level 1"))
    ) {
      break;
    }

    await nvda.perform(nvda.keyboardCommands.moveToNextHeading);
  }

  console.log(await nvda.spokenPhraseLog());
}
