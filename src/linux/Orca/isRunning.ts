import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function isRunning(): Promise<boolean> {
  try {
    const { stdout } = await execFileAsync("pgrep", ["-x", "orca"]);

    if (!stdout.trim()) {
      return false;
    }

    const { stdout: apps } = await execFileAsync("orca", ["--list-apps"]);

    return apps.includes("orca");
  } catch {
    return false;
  }
}
