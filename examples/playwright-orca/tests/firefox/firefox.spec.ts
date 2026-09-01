import { platform, release } from "os";
import { headerNavigation } from "../headerNavigation";
import { logIncludesExpectedPhrases } from "../../../logIncludesExpectedPhrases";
import spokenPhraseSnapshot from "./firefox.spokenPhrase.snapshot.json";
import { orcaTest as test } from "../../orca-test";

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

    await headerNavigation({ page, orca });

    // Assert that we've ended up where we expected and what we were told on
    // the way there is as expected.

    const spokenPhraseLog = await orca.spokenPhraseLog();

    console.log(JSON.stringify(spokenPhraseLog, undefined, 2));

    logIncludesExpectedPhrases(spokenPhraseLog, spokenPhraseSnapshot);
  });
});
