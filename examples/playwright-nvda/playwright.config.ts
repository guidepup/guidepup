import { devices, PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  reportSlowTests: null,
  workers: 1,
  timeout: 10 * 60 * 1000,
  projects: [
    {
      name: "chrome",
      use: { ...devices["Desktop Chrome"], headless: false, video: "on" },
    },
  ],
};

export default config;
