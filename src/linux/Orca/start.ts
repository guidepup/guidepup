import { ERR_ORCA_CANNOT_BE_STARTED } from "../errors";
import { spawn } from "child_process";
import { waitForRunning } from "./waitForRunning";

const MAX_START_ATTEMPTS = 2;

export async function start(): Promise<void> {
  for (let attempt = 0; attempt < MAX_START_ATTEMPTS; attempt++) {
    // TODO: start with Guidepup custom preferences using:
    // --import-dir DIR
    // TODO: work out if get use out of specifying speech system:
    // --speech-system NAME
    const orcaProcess = spawn("orca", ["--replace"], {
      shell: true,
      stdio: "ignore",
    });

    try {
      await waitForRunning();
      return;
    } catch (e) {
      try {
        orcaProcess.kill("SIGKILL");
      } catch {
        // swallow
      }

      if (attempt === MAX_START_ATTEMPTS - 1) {
        throw new Error(`${ERR_ORCA_CANNOT_BE_STARTED}\n${e.message}`, {
          cause: e,
        });
      }
    }
  }
}
