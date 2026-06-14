import { CommandOptions } from "../../CommandOptions";
import { exec } from "child_process";
import { keyCodeCommands } from "./keyCodeCommands";
import { MacOSApplications } from "..";
import { quit } from "../quit";
import { sendKeys } from "../sendKeys";

export async function terminateVoiceOverProcess(
  options?: CommandOptions,
): Promise<void> {
  // Most reliable way (counter-intuitively) is via the keyboard command to
  // quit VoiceOver.
  await sendKeys(keyCodeCommands.quit, MacOSApplications.VoiceOver, options);

  // Failing that we attempt to stop VoiceOver via it's AppleScript API.
  await quit(MacOSApplications.VoiceOver, options);

  // Final fallback to trying to kill the launchd process.
  await new Promise<void>((resolve) => {
    exec(
      `kill -15 $(ps aux | egrep "[V]oiceOver.app/Contents/MacOS/VoiceOver launchd -s" | awk '{print $2}')`,
      () => {
        resolve();
      },
    );
  });
}
