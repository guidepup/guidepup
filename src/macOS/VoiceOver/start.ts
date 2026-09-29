import { activate } from "../activate";
import { Applications } from "../Applications";
import { base } from "../../debug";
import type { CommandOptions } from "../../CommandOptions";
import { DEFAULT_RETRY_COUNT } from "../../constants";
import { delay } from "../../delay";
import { ERR_VOICE_OVER_CANNOT_BE_STARTED } from "../errors";
import { exec } from "child_process";

const debug = base.extend("start");

const VOICE_OVER_STARTER =
  "/System/Library/CoreServices/VoiceOver.app/Contents/MacOS/VoiceOverStarter";

export async function start(options?: CommandOptions): Promise<void> {
  debug("executing VoiceOver Starter");

  await new Promise<void>((resolve, reject) => {
    exec(VOICE_OVER_STARTER, (error) => {
      if (error) {
        debug("VoiceOver Starter failed", error);

        reject(
          new Error(`${ERR_VOICE_OVER_CANNOT_BE_STARTED}\n${error.message}`),
        );
      } else {
        debug("VoiceOver Starter succeeded");

        resolve();
      }
    });
  });

  await delay(500);

  // VoiceOver can take ~10s to answer its first AppleEvent after launch
  // (seen on macOS 27), so allow the activation to retry on AppleEvent timeout.
  await activate(Applications.VoiceOver, {
    retries: DEFAULT_RETRY_COUNT,
    ...options,
  });
}
