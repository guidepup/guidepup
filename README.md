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

[![macOS Sonoma Support](https://img.shields.io/badge/macos-Sonoma-blue.svg?logo=apple)](https://support.apple.com/en-gb/102662)
[![macOS Sequoia Support](https://img.shields.io/badge/macos-Sequoia-blue.svg?logo=apple)](https://support.apple.com/en-gb/102662)
[![macOS Tahoe Support](https://img.shields.io/badge/macos-Tahoe-blue.svg?logo=apple)](https://support.apple.com/en-gb/102662)
[![macOS Golden Gate Support](https://img.shields.io/badge/macos-Golden%20Gate-blue.svg?logo=apple)](https://support.apple.com/en-gb/127455)
[![Windows Server 2022 Support](https://img.shields.io/badge/windows_server-2022-blue.svg?logo=windows)](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2022)
[![Windows Server 2025 Support](https://img.shields.io/badge/windows_server-2025-blue.svg?logo=windows)](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2025)
[![Ubuntu Resolute Support](https://img.shields.io/badge/ubuntu-26.04%2B-blue.svg?logo=ubuntu)](https://releases.ubuntu.com/resolute/)
[![Debian Trixie Support](https://img.shields.io/badge/debian-13%2B-blue.svg?logo=debian)](https://www.debian.org/releases/trixie/)

Guidepup is a screen reader automation library for testing.

It enables testing for <a href="https://www.guidepup.dev/docs/api/class-nvda"><b>NVDA on Windows</b></a>, <a href="https://www.guidepup.dev/docs/api/class-orca"><b>Orca on Linux</b></a>, and <a href="https://www.guidepup.dev/docs/api/class-voiceover"><b>VoiceOver on macOS</b></a> with a single API.

## Capabilities

- **Full Control** - If a screen reader has a keyboard command, then Guidepup supports it.
- **Mirrors Real User Experience** - Assert on what users really do and hear when using screen readers.
- **Framework Agnostic** - Run with Jest, with Playwright, as an independent script, no vendor lock-in.

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
  // On Linux starts Orca, on macOS starts VoiceOver, and on Windows starts NVDA.
  await screenReader.start();

  await screenReader.next();
  await screenReader.nextHeading();
  await screenReader.nextLink();
  await screenReader.nextLandmark();
  await screenReader.previous();
  await screenReader.act();

  console.log(await screenReader.spokenPhraseLog());

  await screenReader.stop();
})();
```

#### NVDA

```ts
import { nvda } from "@guidepup/guidepup";

(async () => {
  await nvda.start();
  await nvda.next();
  await nvda.nextHeading();

  console.log(await nvda.spokenPhraseLog());

  await nvda.perform(nvda.keyboardCommands.moveToNextFormField);

  console.log(await nvda.lastSpokenPhrase());

  await nvda.stop();
})();
```

#### Orca

```ts
import { orca } from "@guidepup/guidepup";

(async () => {
  await orca.start();
  await orca.next();
  await orca.nextHeading();

  console.log(await orca.spokenPhraseLog());

  await orca.perform(orca.keyboardCommands.StructuralNavigator.NextFormField);

  console.log(await orca.lastSpokenPhrase());

  await orca.stop();
})();
```

#### VoiceOver

```ts
import { voiceOver } from "@guidepup/guidepup";

(async () => {
  await voiceOver.start();
  await voiceOver.next();
  await voiceOver.nextHeading();

  console.log(await voiceOver.spokenPhraseLog());

  await voiceOver.perform(voiceOver.keyboardCommands.findNextControl);

  console.log(await voiceOver.lastSpokenPhrase());

  await voiceOver.stop();
})();
```

## Powerful Tooling

Check out some of the other Guidepup tooling:

- [`@guidepup/setup`](https://github.com/guidepup/setup/) - Set up your local or CI environment for screen reader test automation.
- [`@guidepup/playwright`](https://github.com/guidepup/guidepup-playwright/) - Seemless integration of Guidepup with Playwright.
- [`ghcr.io/guidepup/guidepup`](https://github.com/guidepup/guidepup-docker/pkgs/container/guidepup) - Seemless integration of Guidepup in Docker.
- [`@guidepup/virtual-screen-reader`](https://github.com/guidepup/virtual-screen-reader/) - Reliable unit testing for your screen reader a11y workflows.
- [`@guidepup/jest`](https://github.com/guidepup/jest/) - Jest matchers for reliable unit testing of your screen reader a11y workflows.

## Resources

- [Documentation](https://www.guidepup.dev/docs/introduction/what-is-guidepup)
- [API Reference](https://www.guidepup.dev/docs/api/class-guidepup)
- [Contributing](.github/CONTRIBUTING.md)
- [Changelog](https://github.com/guidepup/guidepup/releases)
- [MIT License](https://github.com/guidepup/guidepup/blob/main/LICENSE)
