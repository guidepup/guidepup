import { devices, PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  reportSlowTests: null,
  fullyParallel: false,
  workers: 1,
  timeout: 3 * 60 * 1000,
  retries: 5,
  projects: [
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"], headless: false, video: "on" },
    },
  ],
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
};

export default config;
