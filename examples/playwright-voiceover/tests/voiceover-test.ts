/* eslint-disable no-empty-pattern */
import { test as base } from "@playwright/test";
import { PLAYWRIGHT_APPLICATION } from "./constants";
import { VoiceOver, macOSActivate } from "../../../lib";

const test = base.extend<{ vo: VoiceOver; macOSActivate }>({
  vo: async ({}, use) => {
    const vo = new VoiceOver();

    try {
      await vo.start();
      await macOSActivate(PLAYWRIGHT_APPLICATION);
      await use(vo);
    } finally {
      vo.stopLog();
      await vo.stop();
    }
  },
  macOSActivate: async ({}, use) => {
    await use(macOSActivate);
  },
});

export default test;
