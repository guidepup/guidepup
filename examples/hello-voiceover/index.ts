import {
  macOSActivate,
  MacOSApplications,
  macOSQuit,
  VoiceOver,
} from "../../src/";

const delay = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Opens Safari and navigates to the guidepup GitHub repo.
 */
async function run(): Promise<void> {
  const vo = new VoiceOver();

  try {
    // Start the VoiceOver screenreader
    await vo.start();

    // Open Safari and wait for it to be ready.
    //
    // Not best practice, but expectation is that consumer will perform proper
    // checks to ensure that Safari is ready, most likely using something like
    // playwright to launch and control the browser.
    await macOSActivate(MacOSApplications.Safari);
    await delay(4000);

    // Interact with the toolbar.
    await vo.interact();

    // Navigate across to the address input.
    await vo.next();
    await vo.next();
    await vo.next();
    await vo.next();
    await vo.next();

    // Navigate to guidepup repo.
    await vo.type("https://github.com/guidepup/guidepup");
    await vo.act();

    console.log("Item Text Log:");
    console.log(await vo.itemTextLog());
    console.log("Spoken Phrase Log:");
    console.log(await vo.spokenPhraseLog());
  } catch (e) {
    console.error(e);
  } finally {
    // Ensure we stop VoiceOver.
    await vo.stop();

    // Ensure we quit Safari.
    await macOSQuit(MacOSApplications.Safari);
  }
}

run();
