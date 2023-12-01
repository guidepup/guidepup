import { devices, PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  reportSlowTests: null,
  workers: 1,
  timeout: 5 * 60 * 1000,
  retries: 2,
  projects: [
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], headless: false, video: "on" },
    },
  ],
};

export default config;
