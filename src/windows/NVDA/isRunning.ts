import { DEFAULT_NVDA_PATH } from "./constants";
import { spawnSync } from "child_process";

export async function isRunning(): Promise<boolean> {
  try {
    const a = spawnSync(`"${DEFAULT_NVDA_PATH}" --check-running`, { shell: true, stdio: "ignore" });

    console.log(a.status);

    return true;
  } catch (_) {
    return false
  }
}
