import { CommandOptions } from "../../CommandOptions";
import { execFileSync } from "child_process";
import { keyCodeCommands } from "./keyCodeCommands";
import { MacOSApplications } from "..";
import { quit } from "../quit";
import { sendKeys } from "../sendKeys";

export async function terminateVoiceOverProcess(
  options?: CommandOptions,
): Promise<void> {
  // Most reliable way (counter-intuitively) is via the keyboard command to
  // quit VoiceOver.
  try {
    await sendKeys(keyCodeCommands.quit, undefined, options);
  } catch {
    // VoiceOver may not be healthy enough to accept keyboard input.
  }

  // Failing that we attempt to stop VoiceOver via it's AppleScript API.
  try {
    await quit(MacOSApplications.VoiceOver, options);
  } catch {
    // Continue to the process-level fallback when AppleScript is unavailable.
  }

  try {
    execFileSync(
      "pkill",
      ["-15", "-f", "VoiceOver.app/Contents/MacOS/VoiceOver launchd -s"],
      {
        stdio: "ignore",
        timeout: 2000,
      },
    );
  } catch {
    // `pkill` exits non-zero when no matching VoiceOver process exists.
  }
}
