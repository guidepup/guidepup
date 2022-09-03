import { ChildProcess, spawn } from "child_process";
import { DEFAULT_NVDA_PATH } from "./constants";
import { ERR_NVDA_CANNOT_BE_STARTED } from "../errors";
import { waitForRunning } from "./waitForRunning";

export async function start(): Promise<void> {
  let child: ChildProcess;

  try {
    child = spawn(`"${DEFAULT_NVDA_PATH}"`, ["--minimal"], {
      shell: true,
      stdio: "ignore",
    });
  } catch (e) {
    throw new Error(`${ERR_NVDA_CANNOT_BE_STARTED}\n${e.message}`);
  }

  await waitForRunning();
  child.kill();
}
