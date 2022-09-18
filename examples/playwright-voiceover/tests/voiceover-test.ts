/* eslint-disable no-empty-pattern */
import { macOSActivate, voiceOver } from "../../../lib";
import { test as base } from "@playwright/test";

const test = base.extend<{ voiceOver }>({
  voiceOver: async ({}, use) => {
    try {
      await voiceOver.start();
      await macOSActivate("Playwright");
      await use(voiceOver);
    } finally {
      await voiceOver.stop();
    }
  },
});

export default test;
