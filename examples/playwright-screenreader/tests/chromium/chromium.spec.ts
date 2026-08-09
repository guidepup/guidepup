import { platform, release } from "os";
import { delay } from "../delay";
import { headerNavigation } from "../headerNavigation";
import { log } from "../../../log";
import { logIncludesExpectedPhrases } from "../../../logIncludesExpectedPhrases";
import spokenPhraseSnapshot from "./chromium.spokenPhrase.snapshot.json";
import { srTest as test } from "../../screenreader-test";

test.describe("Chromium Playwright Screen Reader", () => {
  test("I can navigate the Guidepup Github page", async ({
    browser,
    browserName,
    page,
    screenReader,
  }) => {
    const osName = platform();
    const osVersion = release();
    const browserVersion = browser.version();
    const screenReaderName = screenReader.name;
    const screenReaderVersion = screenReader.version;
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

    await headerNavigation({ page, screenReader });

    // Assert that we've ended up where we expected and what we were told on
    // the way there is as expected.

    const itemTextLog = await screenReader.itemTextLog();
    const spokenPhraseLog = await screenReader.spokenPhraseLog();

    console.log(JSON.stringify(itemTextLog, undefined, 2));
    console.log(JSON.stringify(spokenPhraseLog, undefined, 2));

    logIncludesExpectedPhrases(spokenPhraseLog, spokenPhraseSnapshot);
  });

  test("I can capture screen reader output from Playwright commands", async ({
    browser,
    browserName,
    page,
    screenReader,
  }) => {
    const osName = platform();
    const osVersion = release();
    const browserVersion = browser.version();
    const screenReaderName = screenReader.name;
    const screenReaderVersion = screenReader.version;
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

    log("Navigating to live region test page.");
    await page.goto("about:blank", {
      waitUntil: "load",
    });

    await page.setContent(`
      <main>
        <h1>Example 1</h1>
        <button id="trigger">Update</button>
      </main>

      <div role="alert" id="live"></div>

      <script>
        document.querySelector("#trigger").addEventListener("click", () => {
          document.querySelector("#live").textContent = "testing testing 123"
        });

        setInterval(() => {
          document.querySelector("#cart-status").textContent = Math.random();
        }, 2000);
      </script>
    `);

    const input = page.locator("#add-to-cart");
    await input.waitFor();
    await delay(500);

    await screenReader.stop();
    await screenReader.start({ capture: "initial" });

    await screenReader.navigateToWebContent();

    console.log(
      await screenReader.capture(() =>
        page.evaluate(() => {
          document.querySelector("#live")!.textContent = "Playwright overwrite";
        }),
      ),
    );

    await delay(2000);

    await input.focus();
    console.log(await screenReader.capture(() => page.keyboard.press("Enter")));

    await delay(2000);

    await input.focus();
    console.log(await screenReader.capture(() => input.click()));

    console.log(await screenReader.spokenPhraseLog());
  });
});
