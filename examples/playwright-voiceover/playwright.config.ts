import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  reportSlowTests: null,
  workers: 1,
  timeout: 2 * 60 * 1000,
  retries: 2,
};

export default config;
