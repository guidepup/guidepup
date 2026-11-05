import { base } from "../../debug";
import { ERR_ORCA_FAILED_TO_QUIT_RUNNING_ORCA } from "../errors";
import { execFileSync } from "node:child_process";
import { isOrcaRunning } from "./isOrcaRunning";
import { userInfo } from "node:os";
import { waitForCondition } from "../../waitForCondition";

const debug = base.extend("quitRunningOrca");

const ORCA_EXIT_POLL_INTERVAL = 100;
const ORCA_EXIT_TIMEOUT = 5_000;

const signalOrca = (signal: "SIGTERM" | "SIGKILL"): void => {
  try {
    execFileSync("pkill", [
      `--signal=${signal}`,
      "-u",
      String(userInfo().uid),
      "-x",
      "orca",
    ]);
  } catch {
    debug(`No Orca to send ${signal} to`);
  }
};

const waitForOrcaToExit = (): Promise<void> =>
  waitForCondition(() => !isOrcaRunning(), {
    pollInterval: ORCA_EXIT_POLL_INTERVAL,
    pollTimeout: ORCA_EXIT_TIMEOUT,
    timeoutErrorMessage: ERR_ORCA_FAILED_TO_QUIT_RUNNING_ORCA,
  });

/**
 * Kill any Orca owned by this user, without letting it shut down, and wait for
 * it to exit.
 */
export async function killRunningOrca(): Promise<void> {
  signalOrca("SIGKILL");

  await waitForOrcaToExit();
}

/**
 * Quit any Orca owned by this user and wait for it to exit, falling back to
 * SIGKILL.
 *
 * Guidepup's own Orca would otherwise replace it with `--replace`, but only
 * partway through starting. Until then the running Orca owns the D-Bus service
 * Guidepup waits for, so Guidepup talks to the wrong Orca. `--replace` also
 * uses SIGKILL, which skips Orca's shutdown and leaves its modifier keys set up.
 */
export async function quitRunningOrca(): Promise<void> {
  debug("Quitting running Orca");

  signalOrca("SIGTERM");

  try {
    await waitForOrcaToExit();
  } catch {
    debug("Orca did not exit after SIGTERM, sending SIGKILL");

    await killRunningOrca();
  }
}
