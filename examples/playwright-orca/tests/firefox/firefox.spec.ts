import { platform, release } from "os";
import { delay } from "../../../../src/delay";
import { execFileSync } from "child_process";
import { log } from "console";
import { orcaTest as test } from "../../orca-test";

test.use({
  orcaStartOptions: {
    capture: "initial",
  },
});

test.describe("Firefox Playwright Orca", () => {
  test("I can navigate the Guidepup Github opage", async ({ opage, orca }) => {
    const osName = platform();
    const osVersion = release();
    const screenReaderName = orca.name;
    const screenReaderVersion = orca.version;
    const { retry } = test.info();

    console.table({
      osName,
      osVersion,
      screenReaderName,
      screenReaderVersion,
      retry,
    });

    log("Navigating to URL: https://www.guidepup.dev.");
    await opage.goto("https://www.guidepup.dev", {
      waitUntil: "load",
    });

    const header = opage.locator("h1");
    await header.waitFor();
    await delay(500);

    await orca.navigateToWebContent();

    try {
      console.log(execFileSync("orca", ["--list-apps"], { encoding: "utf-8" }));
    } catch (cause) {
      // swallow
      console.warn(cause);
    }

    await header.focus();

    // TODO: flesh out to full example

    await orca.whereAmI();
    await orca.next();
    await orca.next();
    await orca.nextHeading();
    await orca.nextHeading();
    await orca.whereAmI();
  });
});
