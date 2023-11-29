import { nvda, windowsActivate, windowsQuit, windowsRecord } from "../../src";

const delay = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Starts and stops NVDA.
 */
async function run(): Promise<void> {
  let stopRecording;

  try {
    // Start the screen recording.
    stopRecording = windowsRecord(`./recordings/hello-nvda-${+new Date()}.mp4`);

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

    // Navigate across the page using NVDA.
    for (let i = 0; i < 10; i++) {
      await nvda.next();
    }

    // Navigate backwards through the page using keyboard commands.
    for (let i = 0; i < 10; i++) {
      await nvda.press("Shift+Tab");
    }

    console.log("Spoken Phrase Log:");
    console.log(await nvda.spokenPhraseLog());
  } catch (e) {
    console.error(e);
  } finally {
    // Ensure we stop NVDA.
    await nvda.stop();

    // Ensure we quit Edge.
    await windowsQuit("msedge.exe");

    // Ensure we stop the recording.
    stopRecording();
  }
}

run();
