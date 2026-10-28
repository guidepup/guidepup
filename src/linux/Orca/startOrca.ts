import { type ChildProcess, spawn } from "node:child_process";
import { base } from "../../debug";
import { ERR_ORCA_SERVICE_TIMEOUT } from "../errors";
import { getOrcaInstallationPath } from "./getOrcaInstallationPath";
import { join } from "node:path";
import { logProcessOutput } from "./logProcessOutput";
import { SESSION_DBUS_ORCA_WELL_KNOWN_SERVICE_NAME } from "./constants";
import type { SessionDBus } from "./startSessionDBus";
import { terminateProcess } from "./terminateProcess";
import { waitForCondition } from "../../waitForCondition";
import { writeFileSync } from "node:fs";

const debug = base.extend("startOrca");

export interface OrcaProcesses {
  process: ChildProcess;
  /**
   * Follows Orca's debug log into the output, when debug logging is enabled.
   */
  debugLogProcess: ChildProcess | null;
}

/**
 * Start Orca with the guidepup profile and wait for its service to appear on
 * the session D-Bus. If it never does, Orca and its debug log are stopped
 * before the error is thrown.
 *
 * @param {object} options
 * @param {string} options.display The X display for Orca.
 * @param {string} options.runtimeDirectory The session's runtime directory, for Orca's debug log.
 * @param {SessionDBus} options.sessionDBus The session D-Bus for Orca.
 * @param {string} options.speechdAddress The Speech Dispatcher address for Orca.
 */
export async function startOrca({
  display,
  runtimeDirectory,
  sessionDBus,
  speechdAddress,
}: {
  display: string;
  runtimeDirectory: string;
  sessionDBus: SessionDBus;
  speechdAddress: string;
}): Promise<OrcaProcesses> {
  debug("Starting Orca");

  const installationPath = getOrcaInstallationPath();
  const orcaExecutable = join(installationPath, "bin", "orca");
  const args = ["--profile", "guidepup", "--replace"];

  let debugLogProcess: ChildProcess | null = null;

  if (debug.enabled) {
    const orcaDebugLogPath = join(runtimeDirectory, "orca-debug.log");

    writeFileSync(orcaDebugLogPath, "");
    args.push("--debug", `--debug-file=${orcaDebugLogPath}`);

    debugLogProcess = spawn("tail", ["-f", orcaDebugLogPath], {
      stdio: ["ignore", "inherit", "pipe"],
    });

    logProcessOutput(debugLogProcess, "orca-debug-log");
  }

  const orcaProcess = spawn(orcaExecutable, args, {
    env: {
      ...process.env,
      DBUS_SESSION_BUS_ADDRESS: sessionDBus.address,
      DISPLAY: display,
      SPEECHD_ADDRESS: speechdAddress,
    },
  });

  logProcessOutput(orcaProcess, "orca");

  try {
    await waitForCondition(
      async () => {
        debug(
          `Polling for '${SESSION_DBUS_ORCA_WELL_KNOWN_SERVICE_NAME}' name ownership`,
        );

        return await sessionDBus.bus.nameHasOwner(
          SESSION_DBUS_ORCA_WELL_KNOWN_SERVICE_NAME,
        );
      },
      { timeoutErrorMessage: ERR_ORCA_SERVICE_TIMEOUT },
    );
  } catch (error) {
    await terminateProcess(orcaProcess, "Orca");
    await terminateProcess(debugLogProcess, "Orca debug log");

    throw error;
  }

  return { process: orcaProcess, debugLogProcess };
}
