/* eslint-disable no-empty-pattern */
import { macOSActivate, macOSRecord, voiceOver } from "../../../lib";
import { test as base } from "@playwright/test";

const test = base.extend<{ voiceOver }>({
  voiceOver: async ({}, use) => {
    let stopRecording;

    try {
      stopRecording = macOSRecord("./recordings/hello-voiceover.mov");
      await voiceOver.start();
      await macOSActivate("Playwright");
      await use(voiceOver);
    } finally {
      await voiceOver.stop();
      stopRecording();
    }
  },
});

export default test;
