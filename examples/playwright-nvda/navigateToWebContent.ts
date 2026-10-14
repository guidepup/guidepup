import type { CommandOptions, NVDA } from "../../src";
import {
  NVDAKeyCodeCommands,
  WindowsKeyCodes,
  WindowsModifiers,
} from "../../src";
import { cleanString } from "../cleanString";
import { delay } from "../../src/delay";
import type { Page } from "@playwright/test";

const MAX_APPLICATION_SWITCH_RETRY_COUNT = 10;

const SWITCH_APPLICATION = {
  keyCode: [WindowsKeyCodes.Escape],
  modifiers: [WindowsModifiers.Alt],
};

const MOVE_TO_TOP = {
  keyCode: [WindowsKeyCodes.Home],
  modifiers: [WindowsModifiers.Control],
};

const hasBrowserFocus = ({
  applicationName,
  pageTitle,
  windowTitle,
}: {
  applicationName: string;
  pageTitle: string;
  windowTitle: string;
}): boolean => {
  const cleanedApplicationName = cleanString(applicationName);
  const cleanedPageTitle = cleanString(pageTitle);
  const cleanedWindowTitle = cleanString(windowTitle);

  return (
    (cleanedPageTitle.length > 0 &&
      cleanedWindowTitle.startsWith(cleanedPageTitle)) ||
    cleanedWindowTitle.includes(cleanedApplicationName)
  );
};

const focusBrowser = async ({
  nvda,
  applicationName,
  pageTitle,
}: {
  nvda: NVDA;
  applicationName: string;
  pageTitle: string;
}): Promise<void> => {
  await nvda.perform(NVDAKeyCodeCommands.reportTitle);
  let windowTitle = await nvda.lastSpokenPhrase();

  if (hasBrowserFocus({ applicationName, pageTitle, windowTitle })) {
    return;
  }

  let applicationSwitchRetryCount = 0;

  while (applicationSwitchRetryCount < MAX_APPLICATION_SWITCH_RETRY_COUNT) {
    applicationSwitchRetryCount++;

    await nvda.perform(SWITCH_APPLICATION, { capture: false });
    await delay(500);

    await nvda.perform(NVDAKeyCodeCommands.reportTitle);
    windowTitle = await nvda.lastSpokenPhrase();

    if (hasBrowserFocus({ applicationName, pageTitle, windowTitle })) {
      break;
    }
  }
};

export const navigateNVDAtoWebContent = async ({
  nvda,
  page,
  applicationName,
  capture,
}: {
  nvda: NVDA;
  page: Page;
  applicationName: string;
  capture?: CommandOptions["capture"];
}): Promise<void> => {
  const currentSpokenPhraseLog = [...(await nvda.spokenPhraseLog())];
  const currentItemTextLog = [...(await nvda.itemTextLog())];

  await nvda.perform(NVDAKeyCodeCommands.exitFocusMode, { capture: false });
  await delay(100);

  const pageTitle = await page.title();
  await focusBrowser({ nvda, applicationName, pageTitle });

  await page.bringToFront();
  await page.locator("body").waitFor();
  await page.locator("body").focus();
  await page.locator("body").click();
  await page.locator("body").blur();

  // Firefox can leave NVDA focused on the whole browser after an application
  // switch. Toggling browse/focus mode after moving to a focusable item restores
  // browse mode. REF: https://github.com/nvaccess/nvda/issues/5758
  await nvda.perform(NVDAKeyCodeCommands.readNextFocusableItem, {
    capture: false,
  });
  await delay(100);
  await nvda.perform(NVDAKeyCodeCommands.toggleBetweenBrowseAndFocusMode, {
    capture: false,
  });
  await delay(100);
  await nvda.perform(NVDAKeyCodeCommands.toggleBetweenBrowseAndFocusMode, {
    capture: false,
  });
  await delay(100);
  await nvda.perform(NVDAKeyCodeCommands.exitFocusMode, { capture: false });
  await delay(100);

  await nvda.clearSpokenPhraseLog();
  await nvda.clearItemTextLog();

  const spokenPhraseLog = await nvda.spokenPhraseLog();
  const itemTextLog = await nvda.itemTextLog();

  spokenPhraseLog.push(...currentSpokenPhraseLog);
  itemTextLog.push(...currentItemTextLog);

  await nvda.perform(MOVE_TO_TOP, { capture });
};
