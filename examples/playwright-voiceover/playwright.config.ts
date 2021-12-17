import { PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  reportSlowTests: null,
  workers: 1,
  projects: [
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], headless: false, video: "on" },
    },
  ],
};

export default config;
