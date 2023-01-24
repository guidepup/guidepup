import { devices, PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  reportSlowTests: null,
  workers: 1,
  timeout: 2 * 60 * 1000,
  retries: 2,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], headless: false, video: "on" },
    },
  ],
};

export default config;
