import type { CommandOptions, Orca } from "../../src";
import { navigateOrcaToWebContent } from "./navigateToWebContent";
import type { StartOptions } from "../../src/StartOptions";
import { test } from "@playwright/test";
import { unstable_orca } from "../../src";

/**
 * [API Reference](https://www.guidepup.dev/docs/api/class-orca)
 *
 * This object can be used to launch and control Orca.
 *
 * Here's a typical example:
 *
 * ```ts
 * import { unstable_orca } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Start Orca.
 *   await unstable_orca.start();
 *
 *   // Move to the next item.
 *   await unstable_orca.next();
 *
 *   // ... perform some commands.
 *
 *   // Stop Orca.
 *   await unstable_orca.stop();
 * })();
 * ```
 */
export interface OrcaPlaywright extends Orca {
  /**
   * Guidepup Playwright specific command that navigates Orca to the beginning
   * of the browser's web content.
   *
   * This command should be used after a page navigation has completed.
   */
  navigateToWebContent(
    options?: Pick<CommandOptions, "capture">,
  ): Promise<void>;
}

const orcaPlaywright: OrcaPlaywright = unstable_orca as OrcaPlaywright;

/**
 * These tests extend the default Playwright environment that launches the
 * browser with a running instance of the Orca screen reader for macOS.
 *
 * A fresh started Orca instance `orca` is provided to each test.
 */
export const orcaTest = test.extend<{
  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-orca)
   *
   * This object can be used to launch and control Orca.
   *
   * Here's a typical example:
   *
   * ```ts
   * import { unstable_orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await unstable_orca.start();
   *
   *   // Move to the next item.
   *   await unstable_orca.next();
   *
   *   // ... perform some commands.
   *
   *   // Stop Orca.
   *   await unstable_orca.stop();
   * })();
   * ```
   */
  orca: OrcaPlaywright;
  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-start-options)
   *
   * Options to start Orca with, see also [unstable_orca.start([options])](https://www.guidepup.dev/docs/api/class-orca#unstable-orca-start).
   */
  orcaStartOptions: StartOptions;
}>({
  orcaStartOptions: { capture: "initial" },
  orca: async ({ orcaStartOptions, page }, use) => {
    try {
      orcaPlaywright.navigateToWebContent = ({ capture } = {}) =>
        navigateOrcaToWebContent({
          orca: orcaPlaywright,
          page,
          capture,
        });

      await orcaPlaywright.start(orcaStartOptions);

      await use(orcaPlaywright);
    } finally {
      try {
        await orcaPlaywright.stop();
      } catch {
        // swallow stop failure
      }
    }
  },
});
