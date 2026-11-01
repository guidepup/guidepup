import { type ChildProcess, execFileSync, spawn } from "node:child_process";
import { base } from "../../debug";
import { ERR_ORCA_X_SERVER_TIMEOUT } from "../errors";
import { findAvailableDisplay } from "./findAvailableDisplay";
import { logProcessOutput } from "./logProcessOutput";
import { terminateProcess } from "./terminateProcess";
import { waitForCondition } from "../../waitForCondition";

const debug = base.extend("startXServer");

export interface XServer {
  display: string;
  process: ChildProcess | null;
}

/**
 * Use the X server on DISPLAY, or start Xvfb on an available display, and
 * wait until it accepts connections. If it never does, the Xvfb started here
 * is stopped before the error is thrown.
 */
export async function startXServer(): Promise<XServer> {
  debug("Ensuring X Server is running...");

  let display = process.env.DISPLAY;
  let xvfbProcess: ChildProcess | null = null;

  if (!display) {
    display = findAvailableDisplay();

    debug(`Starting Xvfb on DISPLAY=${display}`);

    xvfbProcess = spawn("Xvfb", [display, "-screen", "0", "1280x720x24"]);

    logProcessOutput(xvfbProcess, "xvfb");
  }

  debug(`DISPLAY=${display}`);

  try {
    await waitForCondition(
      () => {
        debug("Polling for X Server running");

        execFileSync("xdpyinfo", ["-display", display]);

        return true;
      },
      { timeoutErrorMessage: ERR_ORCA_X_SERVER_TIMEOUT },
    );
  } catch (error) {
    await terminateProcess(xvfbProcess, "X Server");

    throw error;
  }

  return { display, process: xvfbProcess };
}
