import { activate } from "../activate";
import { Applications } from "../Applications";
import { base } from "../../debug";
import type { CommandOptions } from "../../CommandOptions";
import { DEFAULT_TIMEOUT } from "../../constants";
import { delay } from "../../delay";
import { ERR_VOICE_OVER_CANNOT_BE_STARTED } from "../errors";
import { execFileSync } from "child_process";
import { waitForReady } from "./waitForReady";

const debug = base.extend("start");

// Asks VoiceOver to start with libScreenReader's private `_ScreenReaderStart`,
// which the Command-F5 shortcut also uses. Launched any other way, VoiceOver
// waits ~9s for this request before it starts.
const START_SCRIPT = `ObjC.bindFunction("dlopen", ["void *", ["char *", "int"]]);
$.dlopen("/usr/lib/libScreenReader.dylib", 1);
ObjC.bindFunction("_ScreenReaderStart", ["void", ["int"]]);
$._ScreenReaderStart(0);`;

function requestStart(): void {
  debug("requesting VoiceOver start");

  try {
    execFileSync(
      "/usr/bin/osascript",
      ["-l", "JavaScript", "-e", START_SCRIPT],
      {
        stdio: "ignore",
        timeout: DEFAULT_TIMEOUT,
      },
    );
  } catch (cause) {
    debug("requesting VoiceOver start failed", cause);

    throw new Error(ERR_VOICE_OVER_CANNOT_BE_STARTED, {
      cause,
    });
  }
}

export async function start(options?: CommandOptions): Promise<void> {
  requestStart();

  // VoiceOver can take 10s or more before it answers AppleEvents. Wait for
  // that here, within the running timeout, rather than in `activate()`'s
  // retries.
  await waitForReady(options);

  await delay(500);

  await activate(Applications.VoiceOver, options);
}
