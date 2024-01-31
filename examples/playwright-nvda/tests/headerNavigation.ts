import { nvda as _nvda, WindowsKeyCodes, WindowsModifiers } from "../../../lib";
import { Page, PlaywrightWorkerOptions } from "@playwright/test";
import { applicationNameMap } from "../nvda-test";
import { log } from "../../log";

type NVDA = typeof _nvda;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MAX_APPLICATION_SWITCH_RETRY_COUNT = 10;
const MAX_NAVIGATION_LOOP = 10;

const SWITCH_APPLICATION = {
  keyCode: [WindowsKeyCodes.Escape],
  modifiers: [WindowsModifiers.Alt],
};

const MOVE_TO_TOP = {
  keyCode: [WindowsKeyCodes.Home],
  modifiers: [WindowsModifiers.Control],
};

const focusBrowser = async ({
  applicationName,
  nvda,
}: {
  applicationName: PlaywrightWorkerOptions["browserName"];
  nvda: NVDA;
}) => {
  await nvda.perform(nvda.keyboardCommands.reportTitle);
  let windowTitle = await nvda.lastSpokenPhrase();

  if (windowTitle.includes(applicationName)) {
    return;
  }

  let applicationSwitchRetryCount = 0;

  while (applicationSwitchRetryCount < MAX_APPLICATION_SWITCH_RETRY_COUNT) {
    applicationSwitchRetryCount++;

    await nvda.perform(SWITCH_APPLICATION);
    await nvda.perform(nvda.keyboardCommands.reportTitle);
    windowTitle = await nvda.lastSpokenPhrase();

    if (windowTitle.includes(applicationName)) {
      break;
    }
  }
};

const navigateToWebContent = async ({
  applicationName,
  nvda,
}: {
  applicationName: PlaywrightWorkerOptions["browserName"];
  nvda: NVDA;
}) => {
  // Make sure NVDA is not in focus mode.
  await nvda.perform(nvda.keyboardCommands.exitFocusMode);

  // Ensure application is brought to front and focused.
  await focusBrowser({ applicationName, nvda });

  // NVDA appears to not work well with Firefox when switching between
  // applications resulting in the entire browser window having NVDA focus
  // with focus mode.
  //
  // One workaround is to tab to the next focusable item. From there we can
  // toggle into (yes although we are already in it...) focus mode and back
  // out. In case this ever transpires to not happen as expect, we then ensure
  // we exit focus mode and move NVDA to the top of the page.
  //
  // REF: https://github.com/nvaccess/nvda/issues/5758
  await nvda.perform(nvda.keyboardCommands.readNextFocusableItem);
  await nvda.perform(nvda.keyboardCommands.toggleBetweenBrowseAndFocusMode);
  await nvda.perform(nvda.keyboardCommands.toggleBetweenBrowseAndFocusMode);
  await nvda.perform(nvda.keyboardCommands.exitFocusMode);
  await nvda.perform(MOVE_TO_TOP);

  // Clear out logs.
  await nvda.clearItemTextLog();
  await nvda.clearSpokenPhraseLog();
};

export async function headerNavigation({
  browserName,
  page,
  nvda,
}: {
  browserName: string;
  page: Page;
  nvda: NVDA;
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

  // Focus the browser and navigate to the web content
  const applicationName = applicationNameMap[browserName];
  navigateToWebContent({ applicationName, nvda });

  let headingCount = 0;

  // Move across the headings using VoiceOver 🔎
  while (
    !(await nvda.lastSpokenPhrase()).includes("Framework Agnostic") &&
    headingCount <= MAX_NAVIGATION_LOOP
  ) {
    headingCount++;

    log(`Performing command: "H"`);
    await nvda.perform(nvda.keyboardCommands.moveToNextHeading);
    log(`Screen reader output: "${await nvda.lastSpokenPhrase()}".`);
  }

  let tabCount = 0;

  // Move across text and buttons using NVDA
  while (
    !(await nvda.lastSpokenPhrase()).includes("GitHub") &&
    tabCount <= MAX_NAVIGATION_LOOP
  ) {
    tabCount++;

    log(`Performing command: "Right"`);
    await nvda.next();
    log(`Screen reader output: "${await nvda.lastSpokenPhrase()}".`);
  }

  log(`Performing command: "Left"`);
  await nvda.previous();
  log(`Screen reader output: "${await nvda.lastSpokenPhrase()}".`);

  log(`Performing command: "Enter"`);
  await nvda.act();
  log(`Screen reader output: "${await nvda.lastSpokenPhrase()}".`);
}
