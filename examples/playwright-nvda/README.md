# Playwright NVDA

An example demonstrating using Guidepup for testing NVDA automation with [Playwright](https://playwright.dev/).

Run this example's test with:

```bash
# In the root directory:
npm ci
npm build

# Then in the example directory:
cd ./examples/playwright-nvda
npm ci
npm run browsers
npm run test
```

> Note: please ensure you have set up the [NVDA prerequisites](https://www.guidepup.dev/docs/guides/environment) before running this example.

## Test flow

1. The test launches Chrome using Playwright
2. Navigates to the Playwright website
