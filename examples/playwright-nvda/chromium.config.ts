import { devices, PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  reportSlowTests: null,
  fullyParallel: false,
  workers: 1,
  timeout: 5 * 60 * 1000,
  retries: 5,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], headless: false, video: "on" },
    },
  ],
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
};

export default config;
