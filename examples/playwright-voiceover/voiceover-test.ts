import type { CommandOptions, VoiceOver } from "../../src";
import {
  macOSActivate,
  MacOSKeyCodes,
  voiceOver,
  voiceOverKeyCodeCommands,
} from "../../src";
import { applicationNameMap } from "../applicationNameMap";
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
      const applicationName = applicationNameMap[browserName];

      if (!applicationName) {
        throw new Error(`Browser ${browserName} is not installed.`);
      }

      voiceOverPlaywright.navigateToWebContent = async ({ capture } = {}) => {
        // Ensure application is brought to front and focused.
        await macOSActivate(applicationName);

        // Cancel auto navigation.
        await voiceOverPlaywright.perform(
          { keyCode: MacOSKeyCodes.Control },
          { capture: false },
        );
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

          // Open the web item chooser.
          await voiceOverPlaywright.perform(
            voiceOverKeyCodeCommands.openItemChooser,
            { capture: false },
          );
          await delay(500);

          // Filter by "web content" - currently web content items for all browsers
          // are suffixed by "web content".
          for (const character of "web content") {
            await voiceOverPlaywright.type(character, { capture: false });
            await delay(100);
          }

          // Select the web content window spot.
          await voiceOverPlaywright.perform(
            { keyCode: MacOSKeyCodes.Enter },
            { capture: false },
          );
          await delay(100);

          // Navigate into web content.
          await voiceOverPlaywright.interact({ capture: false });
          await delay(100);

          // Navigate to the beginning of the web content.
          await voiceOverPlaywright.perform(
            voiceOverKeyCodeCommands.moveToBeginningOfText,
            { capture: false },
          );
          await delay(100);

          // Cancel auto navigation
          await voiceOverPlaywright.perform(
            { keyCode: MacOSKeyCodes.Control },
            { capture: false },
          );
          await delay(100);

          // Navigate to the Guidepup marker element at beginning of the web
          // content.
          await voiceOverPlaywright.perform(
            voiceOverKeyCodeCommands.moveToBeginningOfText,
            { capture: false },
          );
          await delay(100);

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
