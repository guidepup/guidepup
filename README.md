# Guidepup

_Screen-reader driver for automation testing._

Guidepup aims to provide a reliable set of APIs to allow users to automate the
usage of screen-readers through JavaScript.

## Getting Started

```ts
import { VoiceOver } from "@guidepup/guidepup";

async function run(): Promise<void> {
  const vo = new VoiceOver();
  await vo.start();
  await vo.moveRight();
  console.log(await vo.getText());
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

## Documentation

[Documentation](https://guidepup.github.io/guidepup/)

## Examples

[Examples](https://github.com/guidepup/guidepup/tree/main/examples)

## Roadmap

- [x] VoiceOver on MacOS
- [ ] NVDA on Windows
- [ ] VoiceOver on iOS
- [ ] Talkback on Android
- [ ] JAWS on Windows

## Related

Building on the shoulders of giants!

Here are some related projects:

- [auto-vo](https://github.com/AccessLint/auto-vo)
- [screen-reader-reader](https://github.com/phenomnomnominal/screen-reader-reader)

## License

[MIT](https://github.com/guidepup/guidepup/blob/main/LICENSE)
