import { platform, release } from "os";
import { delay } from "../../../../src/delay";
import { log } from "console";
import { orcaTest as test } from "../../orca-test";

test.use({
  orcaStartOptions: {
    capture: "initial",
  },
});

test.describe("Firefox Playwright Orca", () => {
  test("I can navigate the Guidepup Github page", async ({
    browser,
    browserName,
    page,
    orca,
  }) => {
    const osName = platform();
    const osVersion = release();
    const browserVersion = browser.version();
    const screenReaderName = orca.name;
    const screenReaderVersion = orca.version;
    const { retry } = test.info();

    console.table({
      osName,
      osVersion,
      browserName,
      browserVersion,
      screenReaderName,
      screenReaderVersion,
      retry,
    });

    log("Navigating to URL: https://www.guidepup.dev.");
    await page.goto("https://www.guidepup.dev", {
      waitUntil: "load",
    });

    const header = page.locator("h1");
    await header.waitFor();
    await delay(500);

    // TODO: flesh out to full example

    await orca.next();
    await orca.next();
    await orca.next();
    await orca.next();
    await orca.next();
  });
});
