/* eslint-disable no-empty-pattern */
import { macOSActivate, VoiceOver } from "../../../lib";
import { test as base } from "@playwright/test";

const test = base.extend<{ vo: VoiceOver }>({
  vo: async ({}, use) => {
    const vo = new VoiceOver();

    try {
      await vo.start();
      await macOSActivate("Playwright");
      await use(vo);
    } finally {
      await vo.stop();
    }
  },
});

export default test;
