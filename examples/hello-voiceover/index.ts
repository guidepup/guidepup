import {
  macOSActivate,
  MacOSApplications,
  macOSQuit,
  voiceOver,
} from "../../src/";
import { macOSRecord } from "@guidepup/record";

const delay = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Opens Safari and navigates to the guidepup GitHub repo.
 */
async function run(): Promise<void> {
  let stopRecording: (() => void) | undefined;

  try {
    // Start the screen recording.
    stopRecording = macOSRecord(
      `./recordings/hello-voiceover-${+new Date()}.mov`
    );

    // Start the VoiceOver screen reader.
    // Set the default to only capture the first page of spoken text per action
    // for speed improvement.
    await voiceOver.start({ capture: "initial" });

    // Open Safari and wait for it to be ready.
    //
    // Not best practice, but expectation is that consumer will perform proper
    // checks to ensure that Safari is ready, most likely using something like
    // playwright to launch and control the browser.
    await macOSActivate(MacOSApplications.Safari);
    await delay(4000);

    // Interact with the toolbar.
    await voiceOver.interact();

    // Navigate across to the address input.
    await voiceOver.next();
    await voiceOver.next();
    await voiceOver.next();
    await voiceOver.next();
    await voiceOver.next();

    // Navigate to guidepup repo.
    await voiceOver.type("https://github.com/guidepup/guidepup");
    await voiceOver.act();
    await delay(4000);

    // Navigate across the page using VoiceOver.
    for (let i = 0; i < 10; i++) {
      await voiceOver.next();
    }

    // Navigate backwards through the page using keyboard commands.
    for (let i = 0; i < 10; i++) {
      await voiceOver.press("Shift+Tab");
    }

    console.log("Item Text Log:");
    console.log(await voiceOver.itemTextLog());
    console.log("Spoken Phrase Log:");
    console.log(await voiceOver.spokenPhraseLog());
  } catch (e) {
    console.error(e);
  } finally {
    // Ensure we stop VoiceOver.
    await voiceOver.stop();

    // Ensure we quit Safari.
    await macOSQuit(MacOSApplications.Safari);

    // Ensure we stop the recording.
    stopRecording?.();
  }
}

run();
