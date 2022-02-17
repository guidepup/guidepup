/* eslint-disable no-empty-pattern */
import { test as base } from "@playwright/test";
import { nvda } from "../../../lib";

const test = base.extend<{ nvda }>({
  nvda: async ({}, use) => {
    try {
      await nvda.start();
      await use(nvda);
    } finally {
      await nvda.stop();
    }
  },
});

export default test;
