# Playwright NVDA

An example demonstrating using Guidepup for testing NVDA automation with [Playwright](https://playwright.dev/).

Run this example's test with:

```console
cd ./examples/playwright-nvda
yarn install --frozen-lockfile
yarn test
```

> Note: please ensure you have setup the [NVDA prerequisites](../../guides/nvda-prerequisites/README.md) before running this example.

## Test flow

1. The test launches Chrome using Playwright
2. Navigates to the Playwright website
