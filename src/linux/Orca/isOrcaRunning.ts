import { execFileSync } from "node:child_process";
import { userInfo } from "node:os";

/**
 * Whether any Orca owned by this user is running, on any display, matching
 * what Orca itself counts as another instance.
 */
export function isOrcaRunning(): boolean {
  try {
    execFileSync("pgrep", ["-u", String(userInfo().uid), "-x", "orca"]);

    return true;
  } catch {
    return false;
  }
}
