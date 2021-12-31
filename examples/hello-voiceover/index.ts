import {
  VoiceOver,
  MacOSApplications,
  macOSActivate,
  macOSSendKeys,
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
    await macOSActivate(MacOSApplications.SAFARI);
    await delay(4000);

    // Interact with the toolbar.
    await vo.commandInteractWithItem();

    // Navigate across to the address input.
    await vo.moveNext();
    await vo.moveNext();
    await vo.moveNext();
    await vo.moveNext();
    await vo.moveNext();

    // Navigate to guidepup repo.
    await macOSSendKeys(MacOSApplications.SAFARI, {
      characters: "https://github.com/guidepup/guidepup",
    });
    await vo.performAction();
    await delay(2000);
  } catch (e) {
    console.error(e);
  } finally {
    // Ensure we stop VoiceOver.
    await vo.stop();
  }
}

run();
