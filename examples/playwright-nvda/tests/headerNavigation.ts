import { expect, Page } from "@playwright/test";
import { nvda as _nvda, WindowsKeyCodes } from "../../../lib";

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

  // Move across the page menu to the Guidepup heading using VoiceOver 🔎
  while ((await nvda.lastSpokenPhrase()) !== "heading, level 1, Guidepup") {
    await nvda.perform({ keyCode: WindowsKeyCodes.h });
  }
}
