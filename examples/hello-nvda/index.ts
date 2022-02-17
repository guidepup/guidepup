import { NVDA } from "../../src";

const delay = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Starts and stops NVDA.
 */
async function run(): Promise<void> {
  const nvda = new NVDA();

  try {
    // Start the NVDA screenreader
    await nvda.start();
    console.log("started");

    await delay(2000);
  } catch (e) {
    console.error(e);
  } finally {
    // Ensure we stop NVDA.
    await nvda.stop();
    console.log("stopped");
  }
}

run();
