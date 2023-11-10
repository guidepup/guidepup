<h1 align="center">Guidepup</h1>
<p align="center">
  <i>Screen reader driver for test automation.</i>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@guidepup/guidepup"><img alt="Guidepup available on NPM" src="https://img.shields.io/npm/v/@guidepup/guidepup" /></a>
  <a href="https://www.npmjs.com/package/@guidepup/guidepup"><img alt="Guidepup available on NPM" src="https://img.shields.io/npm/dt/@guidepup/guidepup"></a>
  <a href="https://github.com/guidepup/guidepup/actions/workflows/test.yml"><img alt="Guidepup test workflows" src="https://github.com/guidepup/guidepup/workflows/Test/badge.svg" /></a>
  <a href="https://github.com/guidepup/guidepup/blob/main/LICENSE"><img alt="Guidepup uses the MIT license" src="https://img.shields.io/github/license/guidepup/guidepup" /></a>
</p>
<p align="center">
  Reliable automation for your screen reader a11y workflows through JavaScript supporting:
</p>
<p align="center">
  <a href="https://www.guidepup.dev/docs/api/class-voiceover"><b>VoiceOver on MacOS</b></a>
</p>
<p align="center">
  <a href="https://www.guidepup.dev/docs/api/class-nvda"><b>NVDA on Windows</b></a>
</p>

## Intro

A11y static analysis tools [only cover 25% of WCAG](https://karlgroves.com/web-accessibility-testing-what-can-be-tested-and-how/) and don't assure on the quality of the user experience for screen reader users. This means teams need to perform lots of manual tests with multiple screen readers to ensure great UX which can take a lot of time... **not anymore!**

With [Guidepup](https://www.guidepup.dev/) you can automate your screen reader test workflows the same you as would for mouse or keyboard based scenarios, no sweat!

## Quick Features

- **Full Control** - if a screen reader has a keyboard command, then Guidepup supports it.
- **Mirrors Real User Experience** - assert on what users really do and hear when using screen readers.
- **Framework Agnostic** - run with Jest, with Playwright, as an independent script, no vendor lock-in.

## Get Started

Set up your environment for screen reader automation with [`@guidepup/setup`](https://github.com/guidepup/setup):

```bash
npx @guidepup/setup
```

Install Guidepup to your project:

```bash
npm install @guidepup/guidepup
```

And get cracking with your first screen reader automation code!

```js
import { voiceOver } from "@guidepup/guidepup";

(async () => {
  // Start your screen reader instance
  await voiceOver.start();

  // Navigate your environment with screen readers just as your users do
  await voiceOver.next();

  // Assert on what your users really see and hear when using screen readers
  console.log(await voiceOver.lastSpokenPhrase());

  // Stop your screen reader instance
  await voiceOver.stop();
})();
```

## Documentation

Head over to the [Guidepup Website](https://www.guidepup.dev/) for guides, real world examples, environment setup, and complete API documentation with examples.

Alternatively, you can also check out the [typedoc API documentation](https://guidepup.github.io/guidepup/).

## Examples

Check out these [awesome examples](https://github.com/guidepup/guidepup/tree/main/examples) to learn how you could use Guidepup in your projects.

Alternatively check out [this project](https://github.com/guidepup/aria-at-tests) to check out the Guidepup compatibility against <https://github.com/w3c/aria-at> test suite.

## See Also

Check out some of the other Guidepup modules:

- [`@guidepup/setup`](https://github.com/guidepup/setup/) - set up your local or CI environment for screen reader test automation.
- [`@guidepup/playwright`](https://github.com/guidepup/guidepup-playwright/) - seemless integration of Guidepup with Playwright.
- [`@guidepup/virtual-screen-reader`](https://github.com/guidepup/virtual-screen-reader/) - reliable unit testing for your screen reader a11y workflows.
- [`@guidepup/jest`](https://github.com/guidepup/jest/) - jest matchers for reliable unit testing of your screen reader a11y workflows. 

If you are using GitHub Actions, check out the dedicated [`guidepup/setup-action`](https://github.com/marketplace/actions/guidepup-setup) to set up your CI ready for screen reader automation.

```yaml
- name: Set Up Environment
  uses: guidepup/setup-action
```

## Support

Full support is available for:

- VoiceOver on MacOS
- NVDA on Windows

## Similar

Here are some similar unaffiliated projects:

- [`@accesslint/voiceover`](https://github.com/AccessLint/screenreaders)
- [`screen-reader-reader`](https://github.com/phenomnomnominal/screen-reader-reader)
- [`web-test-runner-voiceover`](https://github.com/coryrylan/web-test-runner-voiceover)
- [`nvda-testing-driver`](https://github.com/kastwey/nvda-testing-driver)
- [`assistive-webdriver`](https://github.com/AmadeusITGroup/Assistive-Webdriver)
- [`screen-reader-testing-library`](https://github.com/eps1lon/screen-reader-testing-library)

## License

[MIT](https://github.com/guidepup/guidepup/blob/main/LICENSE)
