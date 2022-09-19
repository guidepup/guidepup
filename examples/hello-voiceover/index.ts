import {
  macOSActivate,
  MacOSApplications,
  macOSQuit,
  macOSRecord,
  voiceOver,
} from "../../src/";
import { platform, release } from "os";
import { join } from "path";

const delay = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

const record = async () => {
  const fileName = `hello-voiceover_${platform()}_${release()}_${+new Date()}.mov`;
  const filePath = join("./recordings/", fileName);

  return await macOSRecord(filePath);
};

/**
 * Opens Safari and navigates to the guidepup GitHub repo.
 */
async function run(): Promise<void> {
  let stopRecording;

  try {
    // Start the screen recording.
    stopRecording = await record();

    // Start the VoiceOver screenreader.
    await voiceOver.start();

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
    stopRecording();
  }
}

run();
