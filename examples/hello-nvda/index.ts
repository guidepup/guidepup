import { nvda, windowsActivate, windowsQuit } from "../../src";

const delay = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

const record = async (filepath: string) => {
  try {
    const { windowsRecord } = await import("@guidepup/record");

    return windowsRecord(filepath);
  } catch {
    console.warn(
      "@guidepup/record not available. Recording will be skipped. This is expected on platforms without ffmpeg support (e.g., Windows ARM64).",
    );
  }
};

/**
 * Starts and stops NVDA.
 */
async function run(): Promise<void> {
  let stopRecording: (() => void) | undefined;

  try {
    // Start the screen recording.
    stopRecording = await record(`./recordings/hello-nvda-${+new Date()}.mp4`);

    // Start the NVDA screen reader.
    // Set the default to only capture the first page of spoken text per action
    // for speed improvement.
    await nvda.start({ capture: "initial" });

    // Open Chrome and wait for it to be ready.
    //
    // Not best practice, but expectation is that consumer will perform proper
    // checks to ensure that Chrome is ready, most likely using something like
    // playwright to launch and control the browser.
    await windowsActivate("chrome.exe", "Chrome");
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

    // Ensure we quit Chrome.
    await windowsQuit("chrome.exe");

    // Ensure we stop the recording.
    stopRecording?.();
  }
}

run();
