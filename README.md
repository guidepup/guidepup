# guidepup

_screen-reader driver for automation testing_

```ts
import { VoiceOver } from "@guidepup/guidepup"

async function run(): Promise<void> {
  const vo = new VoiceOver();
  await vo.start();
  await vo.moveRight();
  await vo.moveRight();
  await vo.moveRight();
  console.log(await vo.getText());
  await vo.stop();
}

run();
```
