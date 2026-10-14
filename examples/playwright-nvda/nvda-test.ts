import { NVDA, nvda } from "../../src";
import { applicationNameMap } from "../applicationNameMap";
import type { CommandOptions } from "../../src";
import { navigateNVDAtoWebContent } from "./navigateToWebContent";
import type { StartOptions } from "../../src/StartOptions";
import { test } from "@playwright/test";

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type CaptureCommandOptions = Prettify<Pick<CommandOptions, "capture">>;
type CaptureStartOptions = Prettify<Pick<StartOptions, "capture" | "settings">>;

/**
 * [API Reference](https://www.guidepup.dev/docs/api/class-nvda)
 *
 * This object can be used to launch and control NVDA.
 *
 * Here's a typical example:
 *
 * ```ts
 * import { nvda } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Start NVDA.
 *   await nvda.start();
 *
 *   // Move to the next item.
 *   await nvda.next();
 *
 *   // Stop NVDA.
 *   await nvda.stop();
 * })();
 * ```
 */
export interface NVDAPlaywright extends NVDA {
  /**
   * Guidepup Playwright specific command that navigates NVDA to the beginning
   * of the browser's web content.
   *
   * This command should be used after page navigation.
   */
  navigateToWebContent(options?: CaptureCommandOptions): Promise<void>;
}

const nvdaPlaywright: NVDAPlaywright = nvda as NVDAPlaywright;

/**
 * These tests extend the default Playwright environment that launches the
 * browser with a running instance of the NVDA screen reader for Windows.
 *
 * A fresh started NVDA instance `nvda` is provided to each test.
 */
export const nvdaTest = test.extend<{
  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-nvda)
   *
   * This object can be used to launch and control NVDA.
   *
   * Here's a typical example:
   *
   * ```ts
   * import { nvda } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start NVDA.
   *   await nvda.start();
   *
   *   // Move to the next item.
   *   await nvda.next();
   *
   *   // Stop NVDA.
   *   await nvda.stop();
   * })();
   * ```
   */
  nvda: NVDAPlaywright;
  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-start-options)
   *
   * Options to start NVDA with, see also [nvda.start([options])](https://www.guidepup.dev/docs/api/class-nvda#nvda-start).
   */
  nvdaStartOptions: CaptureStartOptions;
}>({
  nvdaStartOptions: { capture: "initial" },
  nvda: async ({ browserName, page, nvdaStartOptions }, use) => {
    try {
      const applicationName = applicationNameMap[browserName];

      if (!applicationName) {
        throw new Error(`Browser ${browserName} is not recognised.`);
      }

      nvdaPlaywright.navigateToWebContent = ({ capture } = {}) =>
        navigateNVDAtoWebContent({
          nvda: nvdaPlaywright,
          page,
          applicationName,
          capture,
        });

      await nvdaPlaywright.start(nvdaStartOptions);
      await use(nvdaPlaywright);
    } finally {
      try {
        await nvdaPlaywright.stop();
      } catch {
        // swallow stop failure
      }
    }
  },
});
