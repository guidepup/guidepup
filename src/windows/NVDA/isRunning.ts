import { DEFAULT_NVDA_PATH } from "./constants";
import { spawnSync } from "child_process";

export async function isRunning(): Promise<boolean> {
  try {
    const a = spawnSync(`"${DEFAULT_NVDA_PATH}"`, ["--check-running"], {
      shell: true,
      stdio: "ignore",
    });

    return a.status === 0;
  } catch (_) {
    return false;
  }
}
