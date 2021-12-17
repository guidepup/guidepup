# Playwright VoiceOver

An example demonstrating using Guidepup for testing VoiceOver automation with [Playwright](https://playwright.dev/).

Run this example's test with:

```console
cd ./examples/playwright-voiceover
yarn test
```

> Note: please ensure you have setup the [VoiceOver prerequisites](../../guides/voiceover-prerequisites/README.md) before running this example.

## Test flow

1. The test launches Safari using Playwright
2. Navigates to the Playwright website
3. Moves through the website using VoiceOver controlled by Guidepup to the search input
4. Searches for Safari
5. Moves to the Safari section of the docs
