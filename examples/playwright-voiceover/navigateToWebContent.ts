import type { CommandOptions, VoiceOver } from "../../src";
import {
  macOSActivateId,
  MacOSKeyCodes,
  voiceOverKeyCodeCommands,
} from "../../src";
import { delay } from "../../src/delay";
import type { Page } from "@playwright/test";

const cancelCurrentInteraction = async (
  voiceOver: VoiceOver,
): Promise<void> => {
  await voiceOver.perform(
    { keyCode: MacOSKeyCodes.Control },
    { capture: false },
  );
};

const closeMenus = async (
  voiceOver: VoiceOver,
): Promise<void> => {
  await voiceOver.perform(
    { keyCode: MacOSKeyCodes.Escape },
    { capture: false },
  );
};

const openItemChooser = async (
  voiceOver: VoiceOver,
): Promise<void> => {
  let lastSpokenPhrase = "";

  while (!lastSpokenPhrase.toLowerCase().includes("item chooser")) {
    await cancelCurrentInteraction(voiceOver);
    await delay(100);
    await closeMenus(voiceOver);
    await delay(100);

    await voiceOver.perform(voiceOverKeyCodeCommands.openItemChooser, {
      capture: true,
    });
    lastSpokenPhrase = await voiceOver.lastSpokenPhrase();
  }
};

const selectWebContentItem = async (
  voiceOver: VoiceOver,
): Promise<void> => {
  while (true) {
    let matched = false;

    for (const character of "web content") {
      await cancelCurrentInteraction(voiceOver);
      await delay(100);

      await voiceOver.type(character, { capture: "initial" });
      const lastSpokenPhrase = await voiceOver.lastSpokenPhrase();

      if (lastSpokenPhrase.toLowerCase().includes("web content")) {
        matched = true;
        break;
      }
    }

    if (matched) {
      break;
    }

    await voiceOver.perform(
      { keyCode: MacOSKeyCodes.Backspace },
      { capture: false },
    );
    await delay(100);
  }

  await voiceOver.perform({ keyCode: MacOSKeyCodes.Enter }, { capture: false });
};

export const navigateVoiceOverToWebContent = async ({
  voiceOver,
  page,
  applicationId,
  capture,
}: {
  voiceOver: VoiceOver;
  page: Page;
  applicationId: string;
  capture?: CommandOptions["capture"];
}): Promise<void> => {
  const currentSpokenPhraseLog = [...(await voiceOver.spokenPhraseLog())];
  const currentItemTextLog = [...(await voiceOver.itemTextLog())];

  await macOSActivateId(applicationId);
  await cancelCurrentInteraction(voiceOver);
  await delay(100);

  await page.bringToFront();
  await page.locator("body").waitFor();

  try {
    // This marker makes VoiceOver listen to events emitted by Playwright
    // interactions when web content is selected.
    await page.evaluate(() => {
      const marker = document.createElement("input");

      marker.id = "__guidepup_marker__";
      marker.type = "text";
      marker.value = "Guidepup Marker";
      marker.readOnly = true;
      marker.tabIndex = -1;
      marker.autocomplete = "off";
      marker.setAttribute("aria-label", "Guidepup Marker");
      marker.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      `;

      document.body.prepend(marker);
    });

    await openItemChooser(voiceOver);
    await selectWebContentItem(voiceOver);

    await voiceOver.interact({ capture: false });
    await delay(100);

    await voiceOver.clearSpokenPhraseLog();
    await voiceOver.clearItemTextLog();

    const spokenPhraseLog = await voiceOver.spokenPhraseLog();
    const itemTextLog = await voiceOver.itemTextLog();

    spokenPhraseLog.push(...currentSpokenPhraseLog);
    itemTextLog.push(...currentItemTextLog);

    await voiceOver.next({ capture });
  } finally {
    // Restore the original page structure after removing the temporary marker.
    await page.evaluate(() => {
      const marker = document.querySelector("#__guidepup_marker__");

      if (marker) {
        document.body.removeChild(marker);
      }
    });
  }
};
