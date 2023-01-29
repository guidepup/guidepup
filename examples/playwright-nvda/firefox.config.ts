import { devices, PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  reportSlowTests: null,
  workers: 1,
  timeout: 5 * 60 * 1000,
  retries: 0,
  projects: [
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"], headless: false, video: "on" },
    },
  ],
};

export default config;
