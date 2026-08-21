import { base } from "../../debug";
import { execFile } from "child_process";
import { promisify } from "util";

const debug = base.extend("isRunning");

const execFileAsync = promisify(execFile);

export async function isRunning(): Promise<boolean> {
  try {
    const { stdout } = await execFileAsync("pgrep", ["-x", "orca"]);

    debug("`pgrep -x orca`: ", stdout);

    if (!stdout.trim()) {
      return false;
    }

    const { stdout: apps } = await execFileAsync("orca", ["--list-apps"]);

    debug("`orca --list-apps`: ", apps);

    return apps.includes("orca");
  } catch (cause) {
    debug("checks failed: ", cause);

    return false;
  }
}
