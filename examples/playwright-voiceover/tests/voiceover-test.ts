/* eslint-disable no-empty-pattern */
import { macOSActivate, macOSRecord, voiceOver } from "../../../lib";
import { test as base } from "@playwright/test";
import { delay } from "./delay";

const test = base.extend<{ voiceOver }>({
  voiceOver: async ({}, use) => {
    let stopRecording;

    try {
      stopRecording = macOSRecord(`./recordings/playwright-voiceover-${+new Date()}.mov`);
      await voiceOver.start();
      await macOSActivate("Playwright");
      await use(voiceOver);
    } finally {
      await voiceOver.stop();
      stopRecording();
      await delay(50);
    }
  },
});

export default test;
