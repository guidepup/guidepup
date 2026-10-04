import { Applications } from "../Applications";
import { base } from "../../debug";
import { CommandOptions } from "../../CommandOptions";
import { DEFAULT_TIMEOUT } from "../../constants";
import { execFileSync } from "child_process";
import { isRunning } from "./isRunning";
import { keyCodeCommands } from "./keyCodeCommands";
import { runAppleScript } from "../runAppleScript";
import { sendKeys } from "../sendKeys";
import { waitForCondition } from "../../waitForCondition";

const debug = base.extend("terminate");

async function hasStopped(options?: CommandOptions): Promise<boolean> {
  try {
    await waitForCondition(async () => !(await isRunning(options, true)), {
      pollTimeout: DEFAULT_TIMEOUT,
    });

    return true;
  } catch {
    return false;
  }
}

export async function terminateVoiceOverProcess(
  options?: CommandOptions,
): Promise<void> {
  // Every termination method below either launches or toggles VoiceOver when
  // it isn't running, so only proceed if there is something to terminate.
  if (!(await isRunning(options, true))) {
    debug("VoiceOver not running");

    return;
  }

  // Prefer VoiceOver's AppleScript API. This deliberately avoids `quit()` as
  // wrapping `quit` in a transaction can launch VoiceOver when it has already
  // exited.
  try {
    debug("Attempting AppleScript termination");

    await runAppleScript(
      `tell application "${Applications.VoiceOver}"\nquit\nend tell`,
      options,
    );

    debug("AppleScript termination succeeded");
  } catch {
    debug("AppleScript termination failed");
    // VoiceOver may not be healthy enough to respond to AppleScript.
  }

  if (await hasStopped(options)) {
    return;
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

  if (await hasStopped(options)) {
    return;
  }

  // Last resort as the keyboard command toggles VoiceOver, so would turn it
  // back on should it have exited in the meantime.
  try {
    debug("Attempting keyboard command termination");

    await sendKeys(keyCodeCommands.quit, undefined, options);

    debug("Keyboard command termination succeeded");
  } catch {
    debug("Keyboard command termination failed");
    // VoiceOver may not be healthy enough to accept keyboard input.
  }
}
