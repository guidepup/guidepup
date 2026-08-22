import type { CommandOptions, Orca } from "../../src";
import { applicationNameMap } from "../applicationNameMap";
import { execSync } from "child_process";
import { orca } from "../../src";
import type { StartOptions } from "../../src/StartOptions";
import { test } from "@playwright/test";

/**
 * [API Reference](https://www.guidepup.dev/docs/api/class-orca)
 *
 * This object can be used to launch and control Orca.
 *
 * Here's a typical example:
 *
 * ```ts
 * import { orca } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Start Orca.
 *   await orca.start();
 *
 *   // Move to the next item.
 *   await orca.next();
 *
 *   // ... perform some commands.
 *
 *   // Stop Orca.
 *   await orca.stop();
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

const orcaPlaywright: OrcaPlaywright = orca as OrcaPlaywright;

/**
 * These tests extend the default Playwright environment that launches the
 * browser with a running instance of the Orca screen reader for MacOS.
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
   * import { orca } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start Orca.
   *   await orca.start();
   *
   *   // Move to the next item.
   *   await orca.next();
   *
   *   // ... perform some commands.
   *
   *   // Stop Orca.
   *   await orca.stop();
   * })();
   * ```
   */
  orca: OrcaPlaywright;
  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-start-options)
   *
   * Options to start Orca with, see also [orca.start([options])](https://www.guidepup.dev/docs/api/class-orca#orca-start).
   */
  orcaStartOptions: StartOptions;
}>({
  orcaStartOptions: { capture: "initial" },
  orca: async ({ browserName, orcaStartOptions, page }, use) => {
    try {
      const applicationName = applicationNameMap[browserName];

      if (!applicationName) {
        throw new Error(`Browser ${browserName} is not installed.`);
      }

      orcaPlaywright.navigateToWebContent = async () => {
        await page.bringToFront();
      };

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  page: async ({ orca, playwright }, use) => {
    const browser = await playwright.firefox.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      console.log(
        execSync(
          "ps -ef | grep -E '[f]irefox|[o]rca|[a]t-spi|[d]bus'",
        ).toString(),
      );
    } catch {
      // swallow
    }

    try {
      console.log(execSync("orca -l").toString());
    } catch {
      // swallow
    }

    await use(page);
  },
});
