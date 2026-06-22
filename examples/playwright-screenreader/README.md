# Playwright Screen Reader

An example demonstrating using Guidepup for testing screen reader automation with [Playwright](https://playwright.dev/).

Run this example's test with:

```bash
# In the root directory:
npm ci
npm build

# Then in the example directory:
cd ./examples/playwright-screenreader
npm ci
npm rebuild ffmpeg-static --ignore-scripts=false
npm run browsers
npm run test
```

> Note: please ensure you have set up the [environment prerequisites](https://www.guidepup.dev/docs/guides/environment) before running this example.

## Test flow

1. The test launches Chromium using Playwright
2. Navigates to the GitHub website
3. Moves through the website using the default screen reader for the OS, controlled by Guidepup
4. Traverses headings until the Guidepup heading in the README.md is found

## See also

Check out the dedicated [`@guidepup/playwright`](https://github.com/guidepup/guidepup-playwright) module for seamless Guidepup integration with Playwright.
