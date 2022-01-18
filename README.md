<h1 align="center">Guidepup</h1>
<p align="center">
  <i>Screen-reader driver for automation.</i>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@guidepup/guidepup"><img alt="Guidepup available on NPM" src="https://img.shields.io/npm/v/@guidepup/guidepup" /></a>
  <a href="https://github.com/guidepup/guidepup/actions/workflows/test.yml"><img alt="Guidepup test workflows" src="https://github.com/guidepup/guidepup/workflows/Test/badge.svg" /></a>
  <a href="https://github.com/guidepup/guidepup/blob/main/LICENSE"><img alt="Guidepup uses the MIT license" src="https://img.shields.io/github/license/guidepup/guidepup" /></a>
</p>
<p align="center">
  Providing a reliable set of APIs to automate your screen-reader a11y workflows through JavaScript.
</p>

## Getting Started

Install Guidepup to your project:

```bash
npm install @guidepup/guidepup
```

And get cracking with your first screen-reader automation code! 🚀

```ts
import { VoiceOver } from "@guidepup/guidepup";

async function run(): Promise<void> {
  // Construct and start your screen-reader instance 🎉
  const vo = new VoiceOver();
  await vo.start();

  // Navigate your environment with screen-readers just as your users do 🏎
  await vo.moveNext();

  // Assert on what your users really see and hear when using screen-readers 👂
  console.log(await vo.getLastSpokenPhrase());

  await vo.stop();
}

run();
```

## Guides

Check out these [fab guides](https://github.com/guidepup/guidepup/tree/main/guides) on how to set up your local or CI environments for using Guidepup. 📚

## Examples

Check out these [awesome examples](https://github.com/guidepup/guidepup/tree/main/examples) to learn how you could use Guidepup in your projects. 🤓

## API Documentation

Want to dive in? 🤿

The [API documentation](https://guidepup.github.io/guidepup/) has all the information you need to write fantastic screen-reader driven workflows. 🧑‍💻

## See Also

Check out some of the other Guidepup modules:

- [`@guidepup/playwright`](https://github.com/guidepup/guidepup-playwright/)

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

Building on the shoulders of giants! 🙌

Here are some related projects:

- [`auto-vo`](https://github.com/AccessLint/auto-vo)
- [`screen-reader-reader`](https://github.com/phenomnomnominal/screen-reader-reader)
- [`web-test-runner-voiceover`](https://github.com/coryrylan/web-test-runner-voiceover)
- [`nvda-testing-driver`](https://github.com/kastwey/nvda-testing-driver)
- [`assistive-webdriver`](https://github.com/AmadeusITGroup/Assistive-Webdriver)

## License

[MIT](https://github.com/guidepup/guidepup/blob/main/LICENSE)
