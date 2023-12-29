# Guidepup

<a href="https://www.npmjs.com/package/@guidepup/guidepup"><img alt="Guidepup available on NPM" src="https://img.shields.io/npm/v/@guidepup/guidepup" /></a>
<a href="https://github.com/guidepup/guidepup/actions/workflows/test.yml"><img alt="Guidepup test workflows" src="https://github.com/guidepup/guidepup/workflows/Test/badge.svg" /></a>
<a href="https://github.com/guidepup/guidepup/blob/main/LICENSE"><img alt="Guidepup uses the MIT license" src="https://img.shields.io/github/license/guidepup/guidepup" /></a>

## [Documentation](https://guidepup.dev) | [API Reference](https://www.guidepup.dev/docs/api/class-guidepup)

[![MacOS Big Sur Support](https://img.shields.io/badge/macos-Big_Sur-blue.svg?logo=apple)](https://apps.apple.com/id/app/macos-big-sur/id1526878132)
[![MacOS Monetary Support](https://img.shields.io/badge/macos-Monetary-blue.svg?logo=apple)](https://apps.apple.com/us/app/macos-monterey/id1576738294)
[![MacOS Ventura Support](https://img.shields.io/badge/macos-Ventura-blue.svg?logo=apple)](https://apps.apple.com/us/app/macos-ventura/id1638787999)
[![Windows 10 Support](https://img.shields.io/badge/windows-10-blue.svg?logo=windows10)](https://www.microsoft.com/en-gb/software-download/windows10ISO)
[![Windows Server 2019 Support](https://img.shields.io/badge/windows_server-2019-blue.svg?logo=windows)](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2019)
[![Windows Server 2022 Support](https://img.shields.io/badge/windows_server-2022-blue.svg?logo=windows)](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2022)

Guidepup is a screen reader driver for test automation.

It enables testing for <a href="https://www.guidepup.dev/docs/api/class-voiceover"><b>VoiceOver on MacOS</b></a> and <a href="https://www.guidepup.dev/docs/api/class-nvda"><b>NVDA on Windows</b></a> with a single API.

## Capabilities

- **Full Control** - If a screen reader has a keyboard command, then Guidepup supports it.
- **Mirrors Real User Experience** - Assert on what users really do and hear when using screen readers.
- **Framework Agnostic** - Run with Jest, with Playwright, as an independent script, no vendor lock-in.

## Getting Started

Set up your environment for screen reader automation with [`@guidepup/setup`](https://github.com/guidepup/setup):

```bash
npx @guidepup/setup
```

Install Guidepup to your project:

```bash
npm install @guidepup/guidepup
```

And get cracking with your first screen reader automation code!

## Examples

Head over to the [Guidepup Website](https://www.guidepup.dev/) for guides, real world examples, environment setup, and complete API documentation with examples.

You can also check out these [awesome examples](https://github.com/guidepup/guidepup/tree/main/examples) to learn how you could use Guidepup in your projects.

Alternatively check out [this project](https://github.com/guidepup/aria-at-tests) which runs several thousand tests to assert screen reader compatibility against [W3C ARIA-AT](https://github.com/w3c/aria-at) test suite.

### Basic Navigation

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

  await voiceOver.perform(voiceOver.keyboardCommands.findNextHeading);
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

  await nvda.perform(nvda.keyboardCommands.moveToNextHeading);
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

If you are using GitHub Actions, check out the dedicated [`guidepup/setup-action`](https://github.com/marketplace/actions/guidepup-setup) to set up your CI ready for screen reader automation:

```yaml
- name: Set Up Environment For Screen Reader Automation
  uses: guidepup/setup-action
```

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
