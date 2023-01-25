<h1 align="center">Guidepup</h1>
<p align="center">
  <i>Screen reader driver for test automation.</i>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@guidepup/guidepup"><img alt="Guidepup available on NPM" src="https://img.shields.io/npm/v/@guidepup/guidepup" /></a>
  <a href="https://github.com/guidepup/guidepup/actions/workflows/test.yml"><img alt="Guidepup test workflows" src="https://github.com/guidepup/guidepup/workflows/Test/badge.svg" /></a>
  <a href="https://github.com/guidepup/guidepup/blob/main/LICENSE"><img alt="Guidepup uses the MIT license" src="https://img.shields.io/github/license/guidepup/guidepup" /></a>
</p>
<p align="center">
  Reliable automation for your screen reader a11y workflows through JavaScript supporting:
</p>
<p align="center">
  <b>VoiceOver on MacOS</b>
</p>
<p align="center">
  <b>NVDA on Windows</b> - <a href="https://github.com/guidepup/guidepup/pull/33">Coming Soon!</a>
</p>

## Intro

A11y static analysis tools [can only get you so far](https://karlgroves.com/web-accessibility-testing-what-can-be-tested-and-how/) and don't assure on the quality of the user experience for screen reader users. This means teams need to perform lots of manual tests with multiple screen readers to ensure great UX which can take a lot of time... **not anymore!**

With [Guidepup](https://www.guidepup.dev/) you can automate your screen reader test workflows the same you as would for mouse or keyboard based scenarios, no sweat!

## Quick Features

- **Full Control** - if a screen reader has a keyboard command, then Guidepup supports it.
- **Mirrors Real User Experience** - assert on what users really do and hear when using screen readers.
- **Framework Agnostic** - run with Jest, with Playwright, as an independent script, no vendor lock-in.

## Get Started

Setup your environment for screen reader automation with [`@guidepup/setup`](https://github.com/guidepup/setup):

```console
npx @guidepup/setup
```

Install Guidepup to your project:

```console
npm install @guidepup/guidepup
```

And get cracking with your first screen reader automation code!

```ts
import { voiceOver } from "@guidepup/guidepup";

async function run(): Promise<void> {
  // Start your screen reader instance
  await voiceOver.start();

  // Navigate your environment with screen readers just as your users do
  await voiceOver.next();

  // Assert on what your users really see and hear when using screen readers
  console.log(await voiceOver.lastSpokenPhrase());

  await voiceOver.stop();
}

run();
```

## Documentation

Head over to the [Guidepup Website](https://www.guidepup.dev/) for guides, real world examples, environment setup, and complete API documentation with examples.

Alternatively, you can also check out the [typedoc API documentation](https://guidepup.github.io/guidepup/) for all the information you need to write fantastic screen reader driven workflows.

## Examples

Check out these [awesome examples](https://github.com/guidepup/guidepup/tree/main/examples) to learn how you could use Guidepup in your projects.

Alternatively checkout [this project](https://github.com/guidepup/aria-at-tests) to check out the Guidepup compatibility against <https://github.com/w3c/aria-at> test suite.

## See Also

Check out some of the other Guidepup modules:

- [`@guidepup/setup`](https://github.com/guidepup/setup/) - set up your local or CI environment for screen reader test automation.
- [`@guidepup/playwright`](https://github.com/guidepup/guidepup-playwright/) - seemless integration of Guidepup with Playwright.

If you are using GitHub Actions, check out the dedicated [`guidepup/setup-action`](https://github.com/marketplace/actions/guidepup-setup) to setup your CI ready for screen reader automation.

```yaml
- name: Setup Environment
  uses: guidepup/setup-action@0.8.1
```

## Support

- VoiceOver on MacOS - Full Support 🎉
- NVDA on Windows - [Coming Soon](https://github.com/guidepup/guidepup/pull/33)

## Related

Here are some related projects:

- [`auto-vo`](https://github.com/AccessLint/auto-vo)
- [`screen-reader-reader`](https://github.com/phenomnomnominal/screen-reader-reader)
- [`web-test-runner-voiceover`](https://github.com/coryrylan/web-test-runner-voiceover)
- [`nvda-testing-driver`](https://github.com/kastwey/nvda-testing-driver)
- [`assistive-webdriver`](https://github.com/AmadeusITGroup/Assistive-Webdriver)

## License

[MIT](https://github.com/guidepup/guidepup/blob/main/LICENSE)
