import { base } from "../../debug";
import { ERR_ORCA_CANNOT_BE_STARTED } from "../errors";
import { spawn } from "child_process";
import { waitForRunning } from "./waitForRunning";

const debug = base.extend("start");

const MAX_START_ATTEMPTS = 2;

export async function start(): Promise<void> {
  debug("executing `orca --replace`");

  for (let attempt = 0; attempt < MAX_START_ATTEMPTS; attempt++) {
    // TODO: start with Guidepup custom preferences using:
    // --import-dir DIR
    // TODO: work out if get use out of specifying speech system:
    // --speech-system NAME
    const orcaProcess = spawn("orca", ["--replace", "--debug"], {
      shell: true,
      stdio: "ignore",
    });

    try {
      await waitForRunning();

      debug("`orca --replace` succeeded");

      return;
    } catch (cause) {
      debug("`orca --replace` failed", cause, orcaProcess);

      try {
        orcaProcess.kill("SIGKILL");
      } catch {
        // swallow
      }

      if (attempt === MAX_START_ATTEMPTS - 1) {
        throw new Error(ERR_ORCA_CANNOT_BE_STARTED, {
          cause,
        });
      }
    }
  }
}
