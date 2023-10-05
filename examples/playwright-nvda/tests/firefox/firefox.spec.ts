import { headerNavigation } from "../headerNavigation";
import { logIncludesExpectedPhrases } from "../../../logIncludesExpectedPhrases";
import spokenPhraseSnapshot from "./firefox.spokenPhrase.snapshot.json";
import { nvdaTest as test } from "../../nvda-test";

test.describe("Firefox Playwright NVDA", () => {
  test("I can navigate the Guidepup Github page", async ({
    browserName,
    page,
    nvda,
  }) => {
    await headerNavigation({ browserName, page, nvda });

    // Assert that we've ended up where we expected and what we were told on
    // the way there is as expected.

    const spokenPhraseLog = await nvda.spokenPhraseLog();

    console.log(JSON.stringify(spokenPhraseLog, undefined, 2));

    logIncludesExpectedPhrases(spokenPhraseLog, spokenPhraseSnapshot);
  });
});
