import { VoiceOver, Applications, KeyCodes } from "../../src/";
import { keyCode } from "../../src/macOS/keyCode";
import { keystroke } from "../../src/macOS/keystroke";

/**
 * Opens Safari and searches for "GitHub guidepup" on Google.
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
    await vo.activate(Applications.SAFARI);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Interact with the toolbar.
    await vo.gestureInteractWithItem();

    // Navigate across to the address input.
    await vo.moveRight();
    await vo.moveRight();
    await vo.moveRight();
    await vo.moveRight();
    await vo.moveRight();

    // Navigate to Google.
    await keystroke(Applications.SAFARI, {
      characters: "https://www.google.com",
    });
    await keyCode(Applications.SAFARI, {
      keyCode: KeyCodes.KEY_RETURN,
    });

    // Search for "GitHub guidepup" on Google.
    await keystroke(Applications.SAFARI, {
      characters: "GitHub guidepup",
    });
    await keyCode(Applications.SAFARI, {
      keyCode: KeyCodes.KEY_RETURN,
    });
  } catch (e) {
    console.error(e);
  } finally {
    // Ensure we stop VoiceOver.
    await vo.stop();
  }
}

run();
