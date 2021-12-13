import { VoiceOver } from "./macOS/VoiceOver";

async function start() {
  const vo = new VoiceOver();

  await vo.start();
  await vo.activate("Visual Studio Code");
  await vo.moveRight();
  console.log(await vo.getText());
  await vo.moveRight();
  console.log(await vo.getText());
  await vo.moveRight();
  console.log(await vo.getText());
  await vo.moveRight();
  console.log(await vo.getText());
  await vo.moveRight();
  console.log(await vo.getText());
  await vo.moveRight();
  console.log(await vo.getText());
  await vo.stop();
}

start();
