import type { CommandOptions, Orca } from "../../src";
import { focusOrcaBrowser } from "./focusOrcaBrowser";
import type { Page } from "@playwright/test";

export const navigateOrcaToWebContent = async ({
  orca,
  page,
  capture,
}: {
  orca: Orca;
  page: Page;
  capture?: CommandOptions["capture"];
}): Promise<void> => {
  const pageTitle = await page.title();

  await focusOrcaBrowser({
    orca,
    pageTitle,
  });

  await page.bringToFront();
  await page.locator("body").waitFor();
  await page.locator("body").focus();
  await page.locator("body").click();
  await page.locator("body").blur();

  // Start at the top of the web content so the first item is announced.
  await orca.perform(orca.keyboardCommands.StartOfFile, { capture });
};
