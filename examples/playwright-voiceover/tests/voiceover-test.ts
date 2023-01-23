/* eslint-disable no-empty-pattern */
import { macOSActivate, voiceOver } from "../../../lib";
import { test as base } from "@playwright/test";
import type { VoiceOver } from "../../../lib/macOS/VoiceOver/VoiceOver";

const test = base.extend<{ voiceOver: VoiceOver }>({
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
