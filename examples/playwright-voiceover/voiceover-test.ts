import type { CommandOptions, VoiceOver } from "../../src";
import { macOSActivateId, MacOSKeyCodes, voiceOver } from "../../src";
import { applicationIdMap } from "../applicationIdMap";
import { delay } from "../../src/delay";
import type { StartOptions } from "../../src/StartOptions";
import { test } from "@playwright/test";

/**
 * [API Reference](https://www.guidepup.dev/docs/api/class-voiceover)
 *
 * This object can be used to launch and control VoiceOver.
 *
 * Here's a typical example:
 *
 * ```ts
 * import { voiceOver } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Start VoiceOver.
 *   await voiceOver.start();
 *
 *   // Move to the next item.
 *   await voiceOver.next();
 *
 *   // ... perform some commands.
 *
 *   // Stop VoiceOver.
 *   await voiceOver.stop();
 * })();
 * ```
 */
export interface VoiceOverPlaywright extends VoiceOver {
  /**
   * Guidepup Playwright specific command that navigates VoiceOver to the beginning
   * of the browser's web content.
   *
   * This command should be used after a page navigation has completed.
   */
  navigateToWebContent(
    options?: Pick<CommandOptions, "capture">,
  ): Promise<void>;
}

const closeMenus = async ({
  voiceOverPlaywright,
}: {
  voiceOverPlaywright: VoiceOverPlaywright;
}) => {
  await voiceOverPlaywright.perform(
    { keyCode: MacOSKeyCodes.Escape },
    { capture: false },
  );
};

const cancelCurrentInteraction = async ({
  voiceOverPlaywright,
}: {
  voiceOverPlaywright: VoiceOverPlaywright;
}) => {
  await voiceOverPlaywright.perform(
    { keyCode: MacOSKeyCodes.Control },
    { capture: false },
  );
};

const openItemChooser = async ({
  voiceOverPlaywright,
}: {
  voiceOverPlaywright: VoiceOverPlaywright;
}) => {
  let lastSpokenPhrase = "";

  while (!lastSpokenPhrase.toLowerCase().includes("item chooser")) {
    await cancelCurrentInteraction({ voiceOverPlaywright });
    await delay(100);
    await closeMenus({ voiceOverPlaywright });
    await delay(100);

    await voiceOverPlaywright.perform(
      voiceOverPlaywright.keyboardCommands.openItemChooser,
      { capture: true },
    );

    lastSpokenPhrase = await voiceOverPlaywright.lastSpokenPhrase();
  }
};

async function selectWebContentItem({
  voiceOverPlaywright,
}: {
  voiceOverPlaywright: VoiceOverPlaywright;
}) {
  while (true) {
    let matched = false;

    for (const character of "web content") {
      await cancelCurrentInteraction({ voiceOverPlaywright });
      await delay(100);

      await voiceOverPlaywright.type(character, { capture: "initial" });
      const lastSpokenPhrase = await voiceOverPlaywright.lastSpokenPhrase();

      if (lastSpokenPhrase.toLowerCase().includes("web content")) {
        matched = true;

        break;
      }
    }

    if (matched) {
      break;
    }

    // Clear the entire Item Chooser search.
    await voiceOverPlaywright.perform(
      { keyCode: MacOSKeyCodes.Backspace },
      { capture: false },
    );
    await delay(100);
  }

  await voiceOverPlaywright.perform(
    { keyCode: MacOSKeyCodes.Enter },
    { capture: false },
  );
}

const voiceOverPlaywright: VoiceOverPlaywright =
  voiceOver as VoiceOverPlaywright;

/**
 * These tests extend the default Playwright environment that launches the
 * browser with a running instance of the VoiceOver screen reader for MacOS.
 *
 * A fresh started VoiceOver instance `voiceOver` is provided to each test.
 */
export const voiceOverTest = test.extend<{
  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-voiceover)
   *
   * This object can be used to launch and control VoiceOver.
   *
   * Here's a typical example:
   *
   * ```ts
   * import { voiceOver } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start VoiceOver.
   *   await voiceOver.start();
   *
   *   // Move to the next item.
   *   await voiceOver.next();
   *
   *   // ... perform some commands.
   *
   *   // Stop VoiceOver.
   *   await voiceOver.stop();
   * })();
   * ```
   */
  voiceOver: VoiceOverPlaywright;
  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-start-options)
   *
   * Options to start VoiceOver with, see also [voiceOver.start([options])](https://www.guidepup.dev/docs/api/class-voiceover#voiceover-start).
   */
  voiceOverStartOptions: StartOptions;
}>({
  voiceOverStartOptions: { capture: "initial" },
  voiceOver: async ({ browserName, page, voiceOverStartOptions }, use) => {
    try {
      const applicationId = applicationIdMap[browserName];

      if (!applicationId) {
        throw new Error(`Browser ${browserName} is not recognised.`);
      }

      voiceOverPlaywright.navigateToWebContent = async ({ capture } = {}) => {
        const currentSpokenPhraseLog = [
          ...(await voiceOverPlaywright.spokenPhraseLog()),
        ];
        const currentItemTextLog = [
          ...(await voiceOverPlaywright.itemTextLog()),
        ];

        // Ensure application is brought to front and focused.
        await macOSActivateId(applicationId);

        // Cancel automatic behaviours/previous commands.
        await cancelCurrentInteraction({ voiceOverPlaywright });
        await delay(100);

        // Ensure the document is ready and focused.
        await page.bringToFront();
        await page.locator("body").waitFor();

        try {
          // Add an interactive marker to the page that will force VoiceOver
          // to listen to events emitted by Playwright interactions when
          // navigated to.
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

          // Open item chooser and select web content.
          await openItemChooser({ voiceOverPlaywright });
          await selectWebContentItem({ voiceOverPlaywright });

          // Navigate into web content.
          await voiceOverPlaywright.interact({ capture: false });
          await delay(100);

          await voiceOverPlaywright.clearSpokenPhraseLog();
          await voiceOverPlaywright.clearItemTextLog();

          const spokenPhraseLog = await voiceOverPlaywright.spokenPhraseLog();
          const itemTextLog = await voiceOverPlaywright.itemTextLog();

          spokenPhraseLog.push(...currentSpokenPhraseLog);
          itemTextLog.push(...currentItemTextLog);

          // Navigate to the first element of the page using the provided
          // capture settings.
          await voiceOverPlaywright.next({ capture });
        } finally {
          // Remove the temporary Guidepup marker element to restore original
          // page structure.
          await page.evaluate(() => {
            const marker = document.querySelector("#__guidepup_marker__");

            if (marker) {
              document.body.removeChild(marker);
            }
          });
        }
      };

      await voiceOverPlaywright.start(voiceOverStartOptions);
      await use(voiceOverPlaywright);
    } finally {
      try {
        await voiceOverPlaywright.stop();
      } catch {
        // swallow stop failure
      }
    }
  },
});
