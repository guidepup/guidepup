# Playwright VoiceOver

An example demonstrating using Guidepup for testing VoiceOver automation with [Playwright](https://playwright.dev/).

Run this example's test with:

```console
cd ./examples/playwright-voiceover
npm install
npm run test
```

> Note: please ensure you have setup the [VoiceOver prerequisites](../../guides/voiceover-prerequisites/README.md) before running this example.

## Test flow

1. The test launches Safari using Playwright
2. Navigates to the Playwright website
3. Moves through the website using VoiceOver controlled by Guidepup to the search input
4. Searches for Safari
5. Moves to the Webkit section of the docs

## See also

Check out the dedicated [`@guidepup/playwright`](https://github.com/guidepup/guidepup-playwright) module for seamless Guidepup integration with Playwright.

For a dedicated example of using Guidepup with Playwright and CircleCI see <https://github.com/guidepup/circleci-voiceover-example>.
