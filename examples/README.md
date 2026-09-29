# Examples

This directory contains a series of self-contained examples that you can use as
starting points for your setup, or as snippets to pull into your existing
projects:

| Example                                                | Description                                                                                                  |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| [Hello NVDA](./hello-nvda)                             | A basic example demonstrating control of NVDA.                                                               |
| [Hello Voiceover](./hello-voiceover)                   | A basic example demonstrating control of VoiceOver to interact with Safari.                                  |
| [Playwright NVDA](./playwright-nvda)                   | An example demonstrating using Guidepup for NVDA automation with [Playwright](https://playwright.dev/).      |
| [Playwright Voiceover](./playwright-voiceover)         | An example demonstrating using Guidepup for VoiceOver automation with [Playwright](https://playwright.dev/). |
| [GitHub Actions VoiceOver](./github-actions-voiceover) | An example GitHub Actions workflow file to use for VoiceOver testing with Guidepup.                          |
| [CircleCI VoiceOver](./circleci-voiceover)             | An example CircleCI configuration file to use for VoiceOver testing with Guidepup.                           |

## Asserting on Screen Reader Output

When writing screen reader automated tests with Guidepup, assertions target the spoken speech log or the active item text rather than DOM node attributes:

```ts
// Assert on the immediate phrase spoken by VoiceOver or NVDA
const lastPhrase = await screenReader.lastSpokenPhrase();
expect(lastPhrase).toContain("Added to cart");

// Or inspect the full history of phrases announced during navigation
const phrases = await screenReader.spokenPhraseLog();
expect(phrases).toEqual(
  expect.arrayContaining(["heading level 1, Welcome", "main landmark"])
);
```

For more guides on integrating Guidepup into your CI and comparing against DOM-level testing, visit [guidepup.dev](https://www.guidepup.dev/).
