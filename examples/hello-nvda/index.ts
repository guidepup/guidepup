import { nvda, windowsActivate, windowsQuit } from "../../src";

const delay = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Starts and stops NVDA.
 */
async function run(): Promise<void> {
  try {
    // Start the NVDA screen reader.
    // Set the default to only capture the first page of spoken text per action
    // for speed improvement.
    await nvda.start({ capture: "initial" });

    // Open Edge and wait for it to be ready.
    //
    // Not best practice, but expectation is that consumer will perform proper
    // checks to ensure that Edge is ready, most likely using something like
    // playwright to launch and control the browser.
    await windowsActivate("msedge.exe", "Edge");
    await delay(4000);

    // Navigate to guidepup repo.
    await nvda.type("https://github.com/guidepup/guidepup");
    await nvda.act();
    await delay(4000);

    // Navigate across the page.
    for (let i = 0; i < 10; i++) {
      await nvda.next();
    }

    console.log("Spoken Phrase Log:");
    console.log(await nvda.spokenPhraseLog());
  } catch (e) {
    console.error(e);
  } finally {
    // Ensure we stop NVDA.
    await nvda.stop();

    await windowsQuit("msedge.exe");
  }
}

run();
