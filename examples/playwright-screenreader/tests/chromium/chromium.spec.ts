import { platform, release } from "os";
import { headerNavigation } from "../headerNavigation";
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
    const { retry } = test.info();

    console.table({
      osName,
      osVersion,
      browserName,
      browserVersion,
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
});
