# Guidepup

[![Guidepup NPM version)](https://img.shields.io/npm/v/@guidepup/guidepup)](https://www.npmjs.com/package/@guidepup/guidepup)
[![Current test status](https://github.com/guidepup/guidepup/workflows/Test/badge.svg)](https://github.com/guidepup/guidepup/actions/workflows/test.yml)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
[![Guidepup open issues](https://img.shields.io/github/issues/guidepup/guidepup)](https://github.com/guidepup/guidepup/issues)
[![Guidepup stars](https://img.shields.io/github/stars/guidepup/guidepup)](https://github.com/guidepup/guidepup/stargazers)
[![Guidepup forks](https://img.shields.io/github/forks/guidepup/guidepup)](https://github.com/guidepup/guidepup/network/members)
[![Guidepup license](https://img.shields.io/github/license/guidepup/guidepup)](https://github.com/guidepup/guidepup/blob/main/LICENSE)

_Screen-reader driver for automation testing._

Guidepup aims to provide a reliable set of APIs to allow users to automate the
usage of screen-readers through JavaScript.

## Getting Started

```ts
import { VoiceOver } from "@guidepup/guidepup";

async function run(): Promise<void> {
  const vo = new VoiceOver();
  await vo.start();
  await vo.moveNext();
  console.log(await vo.getLastSpokenPhrase());
  await vo.stop();
}

run();
```

## Installation

Install Guidepup with npm or yarn:

```bash
# npm
npm install @guidepup/guidepup

# yarn
yarn add @guidepup/guidepup
```

## Guides

[Guides](https://github.com/guidepup/guidepup/tree/main/guides)

## API Documentation

[API Documentation](https://guidepup.github.io/guidepup/)

## Examples

[Examples](https://github.com/guidepup/guidepup/tree/main/examples)

## Roadmap

Screen-reader support:

- [x] VoiceOver on MacOS
- [ ] NVDA on Windows (WIP)
- [ ] VoiceOver on iOS
- [ ] Talkback on Android

Environment support:

- [x] MacOS local machine
- [ ] MacOS virtual machine
  - [x] CircleCI
  - [ ] GitHub Actions (WIP)
- [ ] Windows local machine
- [ ] Windows virtual machine

## Related

Building on the shoulders of giants!

Here are some related projects:

- [auto-vo](https://github.com/AccessLint/auto-vo)
- [screen-reader-reader](https://github.com/phenomnomnominal/screen-reader-reader)
- [web-test-runner-voiceover](https://github.com/coryrylan/web-test-runner-voiceover)

## License

[MIT](https://github.com/guidepup/guidepup/blob/main/LICENSE)
