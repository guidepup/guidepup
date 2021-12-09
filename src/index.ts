import { VoiceOver } from "./macOS/VoiceOver";

async function start() {
  const vo = new VoiceOver();

  await vo.start();
  await vo.activate("Visual Studio Code");
  await vo.moveRight();
  console.log(await vo.getLastPhrase());
  await vo.moveRight();
  console.log(await vo.getLastPhrase());
  await vo.moveRight();
  console.log(await vo.getLastPhrase());
  await vo.moveRight();
  console.log(await vo.getLastPhrase());
  await vo.moveLeft();
  console.log(await vo.getLastPhrase());
  // await vo.saveLastPhrase();
  await vo.stop();
}

start();
