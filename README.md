<div align="center">
  <img align="center" alt="" height="120px" width="120px" src="https://github.com/guidepup/guidepup/raw/main/img/logo.png">
  <h1 align="center">Guidepup</h1>
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/@guidepup/guidepup"><img alt="Guidepup available on NPM" src="https://img.shields.io/npm/v/@guidepup/guidepup" /></a>
  <a href="https://github.com/guidepup/guidepup/actions/workflows/test.yml"><img alt="Guidepup test workflows" src="https://github.com/guidepup/guidepup/workflows/Test/badge.svg" /></a>
  <a href="https://github.com/guidepup/guidepup/blob/main/LICENSE"><img alt="Guidepup uses the MIT license" src="https://img.shields.io/github/license/guidepup/guidepup" /></a>
</div>

## [Documentation](https://guidepup.dev) | [API Reference](https://www.guidepup.dev/docs/api/class-guidepup)

[![MacOS Sonoma Support](https://img.shields.io/badge/macos-Somona-blue.svg?logo=apple)](https://apps.apple.com/us/app/macos-sonoma/id6450717509)
[![MacOS Sequoia Support](https://img.shields.io/badge/macos-Sequoia-blue.svg?logo=apple)](https://apps.apple.com/us/app/macos-sequoia/id6596773750)
[![MacOS Tahoe Support](https://img.shields.io/badge/macos-Tahoe-blue.svg?logo=apple)](https://www.apple.com/uk/os/macos/)
[![Windows Server 2022 Support](https://img.shields.io/badge/windows_server-2022-blue.svg?logo=windows)](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2022)
[![Windows Server 2025 Support](https://img.shields.io/badge/windows_server-2025-blue.svg?logo=windows)](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2025)

Guidepup is a screen reader automation library for testing.

It enables testing for <a href="https://www.guidepup.dev/docs/api/class-voiceover"><b>VoiceOver on MacOS</b></a> and <a href="https://www.guidepup.dev/docs/api/class-nvda"><b>NVDA on Windows</b></a> with a single API.

## Capabilities

- **Full Control** - If a screen reader has a keyboard command, then Guidepup supports it.
- **Mirrors Real User Experience** - Assert on what users really do and hear when using screen readers.
- **Framework Agnostic** - Run with Jest, with Playwright, as an independent script, no vendor lock-in.

## Why Screen Reader Automation?

Traditional automated accessibility tools (such as linters, `axe-core`, or browser accessibility tree assertions in Playwright) inspect the **DOM** or the **browser's internal accessibility tree**. While essential for catching static violations, they stop at the browser boundary.

Guidepup tests the entire end-to-end user experience by automating the **OS Accessibility API layer** (macOS Accessibility API for VoiceOver, Windows UI Automation / IAccessible2 for NVDA) and the **screen reader engine**, enabling you to assert directly on spoken output and assistive technology navigation.

### The Accessibility Testing Pyramid

| Layer | Tools | What It Validates | When to Use |
| :--- | :--- | :--- | :--- |
| **Static Analysis** | `eslint-plugin-jsx-a11y` | Syntax, static ARIA attributes, missing basic props | Pre-commit / build time linting |
| **Automated Rule Scanners** | `axe-core`, IBM Equal Access | Static WCAG rule compliance, contrast, missing labels | Fast CI smoke checks for known rule violations |
| **Browser A11y Tree** | Playwright accessibility snapshot | Computed role, name, states in the browser tree | Component-level structure verification |
| **End-to-End Screen Reader** | **Guidepup** (VoiceOver, NVDA) | Spoken phrases, screen reader virtual cursor navigation, dynamic announcements | Critical user workflows and assistive technology regressions |

### Problems Only Screen Reader Automation Can Catch

- **Live regions injected dynamically**: Adding `<div aria-live="polite">` after an action passes DOM and static audits, but is frequently ignored by real screen readers unless the region is pre-established in the DOM. Guidepup lets you assert that `screenReader.lastSpokenPhrase()` actually includes the status message.
- **Screen reader virtual cursor navigation**: Browsers only dispatch `Tab` and `Shift+Tab` focus events. Screen reader users navigate static text, headings, and landmarks using dedicated screen reader keyboard cursors (e.g. VoiceOver rotor/VO-arrows, NVDA Browse Mode). Guidepup simulates these real assistive cursor movements.
- **Browser and screen reader translation quirks**: Valid WAI-ARIA markup can still fail to announce or misbehave due to differences in how specific OS screen readers parse browser accessibility trees (e.g. historical `aria-activedescendant` inconsistencies or Unicode symbol pronunciations).

For a deeper dive into these patterns, read the [Guidepup vs Other Accessibility Testing](https://www.guidepup.dev/docs/introduction/guidepup-vs-other-accessibility-testing) guide and [Accessibility Testing Gotchas](https://www.guidepup.dev/docs/introduction/accessibility-testing-gotchas).

## Getting Started

Set up your machine for screen reader automation:

```sh
npx @guidepup/setup setup
```

Install Guidepup to your project:

```sh
npm install @guidepup/guidepup
```

Install the Guidepup screen reader assets:

```sh
npx @guidepup/setup install
```

And get cracking with your first screen reader automation code!

## Examples

Head over to the [Guidepup Website](https://www.guidepup.dev/) for guides, real world examples, environment setup, and complete API documentation with examples.

You can also check out these [examples](https://github.com/guidepup/guidepup/tree/main/examples) to learn how you could use Guidepup in your projects.

### Basic Navigation

#### Cross-Platform

```ts
import { screenReader } from "@guidepup/guidepup";

(async () => {
  // On MacOS starts VoiceOver, on Windows starts NVDA.
  await screenReader.start();

  await screenReader.next();
  console.log(await screenReader.spokenPhraseLog());

  await screenReader.stop();
})();
```

#### VoiceOver

```ts
import { voiceOver } from "@guidepup/guidepup";

(async () => {
  await voiceOver.start();

  await voiceOver.next();
  console.log(await voiceOver.spokenPhraseLog());

  await voiceOver.stop();
})();
```

#### NVDA

```ts
import { nvda } from "@guidepup/guidepup";

(async () => {
  await nvda.start();

  await nvda.next();
  console.log(await nvda.spokenPhraseLog());

  await nvda.stop();
})();
```

### Complex Navigation

#### VoiceOver

```ts
import { voiceOver } from "@guidepup/guidepup";

(async () => {
  await voiceOver.start();

  await voiceOver.nextHeading();
  console.log(await voiceOver.itemText());

  await voiceOver.perform(voiceOver.keyboardCommands.findNextControl);
  console.log(await voiceOver.lastSpokenPhrase());

  await voiceOver.stop();
})();
```

#### NVDA

```ts
import { nvda } from "@guidepup/guidepup";

(async () => {
  await nvda.start();

  await nvda.nextHeading();
  console.log(await nvda.itemText());

  await nvda.perform(nvda.keyboardCommands.moveToNextFormField);
  console.log(await nvda.lastSpokenPhrase());

  await nvda.stop();
})();
```

## Powerful Tooling

Check out some of the other Guidepup modules:

- [`@guidepup/setup`](https://github.com/guidepup/setup/) - Set up your local or CI environment for screen reader test automation.
- [`@guidepup/playwright`](https://github.com/guidepup/guidepup-playwright/) - Seemless integration of Guidepup with Playwright.
- [`@guidepup/virtual-screen-reader`](https://github.com/guidepup/virtual-screen-reader/) - Reliable unit testing for your screen reader a11y workflows.
- [`@guidepup/jest`](https://github.com/guidepup/jest/) - Jest matchers for reliable unit testing of your screen reader a11y workflows.

## Similar

Here are some similar unaffiliated projects:

- [`at-driver`](https://github.com/w3c/at-driver)
- [`nvda-at-automation`](https://github.com/Prime-Access-Consulting/nvda-at-automation)
- [`@accesslint/voiceover`](https://github.com/AccessLint/screenreaders)
- [`screen-reader-reader`](https://github.com/phenomnomnominal/screen-reader-reader)
- [`web-test-runner-voiceover`](https://github.com/coryrylan/web-test-runner-voiceover)
- [`nvda-testing-driver`](https://github.com/kastwey/nvda-testing-driver)
- [`assistive-webdriver`](https://github.com/AmadeusITGroup/Assistive-Webdriver)
- [`screen-reader-testing-library`](https://github.com/eps1lon/screen-reader-testing-library)

## Resources

- [Documentation](https://www.guidepup.dev/docs/intro)
- [API Reference](https://www.guidepup.dev/docs/api/class-guidepup)
- [Contributing](.github/CONTRIBUTING.md)
- [Changelog](https://github.com/guidepup/guidepup/releases)
- [MIT License](https://github.com/guidepup/guidepup/blob/main/LICENSE)
