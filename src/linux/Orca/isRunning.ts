import { base } from "../../debug";
import { execFileSync } from "child_process";

const debug = base.extend("isRunning");

export async function isRunning(): Promise<boolean> {
  try {
    const processRunning =
      execFileSync("pgrep", ["-x", "orca"], {
        encoding: "utf8",
        timeout: 2000,
      }).trim().length > 0;

    debug("orca running", processRunning);

    return processRunning;
  } catch {
    debug("`pgrep -x orca` failed");

    return false;
  }
}
