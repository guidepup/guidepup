import { spawnSync } from "child_process";

const MAX_START_ATTEMPTS = 2;

export async function start(): Promise<void> {
  for (let attempt = 0; attempt < MAX_START_ATTEMPTS; attempt++) {
    try {
      spawnSync("orca ", ["--replace"], {
        shell: true,
        stdio: "ignore",
      });
    } catch (e) {
      throw new Error(`TODO: start failed error`, {
        cause: e,
      });
    }

    // TODO: wait for running
  }
}
