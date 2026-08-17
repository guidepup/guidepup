import { base } from "../../debug";
import { CommandOptions } from "../../CommandOptions";
import { execFileSync } from "child_process";
import { keyCodeCommands } from "./keyCodeCommands";
import { MacOSApplications } from "..";
import { quit } from "../quit";
import { sendKeys } from "../sendKeys";

const debug = base.extend("terminate");

export async function terminateVoiceOverProcess(
  options?: CommandOptions,
): Promise<void> {
  // Most reliable way (counter-intuitively) is via the keyboard command to
  // quit VoiceOver.
  try {
    debug("Attempting keyboard command termination");

    await sendKeys(keyCodeCommands.quit, undefined, options);

    debug("Keyboard command termination succeeded");
  } catch {
    debug("Keyboard command termination failed");
    // VoiceOver may not be healthy enough to accept keyboard input.
  }

  // Failing that we attempt to stop VoiceOver via it's AppleScript API.
  try {
    debug("Attempting AppleScript termination");

    await quit(MacOSApplications.VoiceOver, options);

    debug("AppleScript termination succeeded");
  } catch {
    debug("AppleScript termination failed");
    // Continue to the process-level fallback when AppleScript is unavailable.
  }

  try {
    debug("Attempting pkill termination");

    execFileSync(
      "pkill",
      ["-15", "-f", "VoiceOver.app/Contents/MacOS/VoiceOver launchd -s"],
      {
        stdio: "ignore",
        timeout: 2000,
      },
    );

    debug("pkill termination succeeded");
  } catch {
    debug("pkill termination failed");
    // `pkill` exits non-zero when no matching VoiceOver process exists.
  }
}
