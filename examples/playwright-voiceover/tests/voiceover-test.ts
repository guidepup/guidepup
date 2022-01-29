/* eslint-disable no-empty-pattern */
import { test as base } from "@playwright/test";
import { VoiceOver, macOSActivate } from "../../../lib";

const PLAYWRIGHT_APPLICATION = "Playwright";

const test = base.extend<{ vo: VoiceOver }>({
  vo: async ({}, use) => {
    const vo = new VoiceOver();

    try {
      await vo.start();
      await macOSActivate(PLAYWRIGHT_APPLICATION);
      await use(vo);
    } finally {
      await vo.stop();

      console.log("Item Text Log:");
      console.log(await vo.getItemTextLog());
      console.log("Spoken Phrase Log:");
      console.log(await vo.getSpokenPhraseLog());
    }
  },
});

export default test;
