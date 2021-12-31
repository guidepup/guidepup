import { NVDA } from "../../src";

const delay = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

async function run(): Promise<void> {
  const nvda = new NVDA();

  try {
    // Start the NVDA screenreader
    await nvda.start();

    await delay(2000);
  } catch (e) {
    console.error(e);
  } finally {
    // Ensure we stop VoiceOver.
    await nvda.stop();
  }
}

run();
