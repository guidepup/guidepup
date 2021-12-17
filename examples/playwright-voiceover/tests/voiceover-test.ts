/* eslint-disable no-empty-pattern */
import { test as base } from "@playwright/test";
import { PLAYWRIGHT_APPLICATION } from "./constants";
import { VoiceOver } from "../../../lib";

const test = base.extend<{ vo: VoiceOver }>({
  vo: async ({}, use) => {
    const vo = new VoiceOver();

    try {
      await vo.start();
      await vo.activate(PLAYWRIGHT_APPLICATION);
      await use(vo);
    } finally {
      vo.stopLog();
      await vo.stop();
    }
  },
});

export default test;
