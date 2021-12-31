/* eslint-disable no-empty-pattern */
import { test as base } from "@playwright/test";
import { NVDA } from "../../../lib";

const test = base.extend<{ nvda: NVDA }>({
  nvda: async ({}, use) => {
    const nvda = new NVDA();

    try {
      await nvda.start();
      await use(nvda);
    } finally {
      await nvda.stop();
    }
  },
});

export default test;
