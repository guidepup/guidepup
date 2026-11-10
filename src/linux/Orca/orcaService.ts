import { execFileSync } from "node:child_process";

const ORCA_SERVICE = "orca.service";
const ORCA_SERVICE_START_TIMEOUT = 10_000;

/**
 * Whether the user's service manager is running Orca, or restarting it.
 *
 * Orca's unit has `Restart=always` and `ExecStart=orca --replace`, so any Orca
 * it runs must be stopped through the unit. Killing the process makes the unit
 * start it again, which replaces Guidepup's Orca.
 */
export function isOrcaServiceActive(): boolean {
  try {
    const state = execFileSync(
      "systemctl",
      ["--user", "show", ORCA_SERVICE, "--property=ActiveState", "--value"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();

    return state !== "inactive" && state !== "failed";
  } catch {
    return false;
  }
}

export function stopOrcaService(): void {
  execFileSync("systemctl", ["--user", "stop", ORCA_SERVICE]);
}

/**
 * Start the unit and wait for it, so a following `orca.start()` finds it
 * running, within a limit as this holds up `orca.stop()`.
 */
export function startOrcaService(): void {
  execFileSync("systemctl", ["--user", "start", ORCA_SERVICE], {
    timeout: ORCA_SERVICE_START_TIMEOUT,
  });
}
