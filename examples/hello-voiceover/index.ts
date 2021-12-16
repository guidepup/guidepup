import { VoiceOver, MacOSApplications, MacOSKeyCodes } from "../../src/";
import { keyCode } from "../../src/macOS/keyCode";
import { keystroke } from "../../src/macOS/keystroke";

const delay = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Opens Safari and searches for "GitHub Guidepup" on Google.
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
    await vo.activate(MacOSApplications.SAFARI);
    await delay(2000);

    // Interact with the toolbar.
    await vo.gestureInteractWithItem();

    // Navigate across to the address input.
    await vo.gestureMoveToNext();
    await vo.gestureMoveToNext();
    await vo.gestureMoveToNext();
    await vo.gestureMoveToNext();
    await vo.gestureMoveToNext();

    // Navigate to Google.
    await keystroke(MacOSApplications.SAFARI, {
      characters: "https://www.google.com",
    });
    await keyCode(MacOSApplications.SAFARI, {
      keyCode: MacOSKeyCodes.KEY_RETURN,
    });
    await delay(2000);

    // Search for "GitHub Guidepup" on Google.
    await keystroke(MacOSApplications.SAFARI, {
      characters: "GitHub Guidepup",
    });
    // await keyCode(Applications.SAFARI, {
    //   keyCode: KeyCodes.KEY_RETURN,
    // });
    await vo.performAction();
  } catch (e) {
    console.error(e);
  } finally {
    // Ensure we stop VoiceOver.
    await vo.stop();
  }
}

run();
