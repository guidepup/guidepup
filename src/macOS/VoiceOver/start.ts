import { exec, execFileSync } from "child_process";
import { activate } from "../activate";
import { Applications } from "../Applications";
import { base } from "../../debug";
import type { CommandOptions } from "../../CommandOptions";
import { delay } from "../../delay";
import { ERR_VOICE_OVER_CANNOT_BE_STARTED } from "../errors";
import { release } from "node:os";

const debug = base.extend("start");

const VOICE_OVER_APP = "/System/Library/CoreServices/VoiceOver.app";
const VOICE_OVER_STARTER = `${VOICE_OVER_APP}/Contents/MacOS/VoiceOverStarter`;

function platformMajorVersion(): number {
  const osVersion = release().split(".", 1)[0];

  return Number(osVersion);
}

export async function start(options?: CommandOptions): Promise<void> {
  const darwinMajorVersion = platformMajorVersion();

  if (darwinMajorVersion >= 27) {
    debug("opening VoiceOver app");

    try {
      execFileSync("/usr/bin/open", ["-a", VOICE_OVER_APP], {
        stdio: "ignore",
        timeout: 2000,
      });
    } catch (cause) {
      debug("opening VoiceOver app failed", cause);

      throw new Error(ERR_VOICE_OVER_CANNOT_BE_STARTED, {
        cause,
      });
    }
  } else {
    debug("executing VoiceOver Starter");

    await new Promise<void>((resolve, reject) => {
      exec(VOICE_OVER_STARTER, (cause) => {
        if (cause) {
          debug("VoiceOver Starter failed", cause);

          reject(new Error(ERR_VOICE_OVER_CANNOT_BE_STARTED, { cause }));
        } else {
          debug("VoiceOver Starter succeeded");

          resolve();
        }
      });
    });
  }

  await delay(500);

  await activate(Applications.VoiceOver, options);
}
