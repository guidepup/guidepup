import { type ChildProcess, spawn } from "node:child_process";
import { base } from "../../debug";
import { ERR_ORCA_SPEECH_DISPATCHER_SERVICE_TIMEOUT } from "../errors";
import { getOrcaInstallationPath } from "./getOrcaInstallationPath";
import { isUnixSocket } from "./isUnixSocket";
import { join } from "node:path";
import { logProcessOutput } from "./logProcessOutput";
import { mkdirSync } from "node:fs";
import { terminateProcess } from "./terminateProcess";
import { waitForCondition } from "../../waitForCondition";

const debug = base.extend("startSpeechDispatcher");

export interface SpeechDispatcher {
  /**
   * The SPEECHD_ADDRESS for Orca.
   */
  address: string;
  /**
   * The socket that guidepup's speech-dispatcher module sends speech to.
   */
  guidepupSocketPath: string;
  process: ChildProcess;
}

/**
 * Start Speech Dispatcher with guidepup's configuration and modules, and wait
 * for its socket to appear. If it never does, Speech Dispatcher is stopped
 * before the error is thrown.
 *
 * @param {string} runtimeDirectory The session's runtime directory, for its sockets.
 */
export async function startSpeechDispatcher(
  runtimeDirectory: string,
): Promise<SpeechDispatcher> {
  debug("Starting Speech Dispatcher");

  const installationPath = getOrcaInstallationPath();
  const speechdDirectory = join(installationPath, "speechd");
  const speechdModulesDirectory = join(speechdDirectory, "modules");
  const speechdLogsDirectory = join(speechdDirectory, "logs");

  // Each session gets its own directory for its sockets. With shared paths,
  // a previous session's speech-dispatcher module could still be exiting
  // and remove the new session's socket. Keep it short: Unix socket paths
  // are limited to 108 bytes.
  const speechdSocketPath = join(runtimeDirectory, "speechd.sock");
  const guidepupSocketPath = join(runtimeDirectory, "guidepup.sock");

  mkdirSync(speechdLogsDirectory, { recursive: true });

  const args = [
    "--run-single",
    "--config-dir",
    speechdDirectory,
    "--module-dir",
    speechdModulesDirectory,
    "--log-dir",
    speechdLogsDirectory,
    "--communication-method",
    "unix_socket",
    "--socket-path",
    speechdSocketPath,
    "--timeout",
    "0",
  ];

  if (debug.enabled) {
    args.push("--log-level", "5");
  }

  // Start Speech Dispatcher with SIGPIPE ignored, which exec keeps. While it
  // loads modules, before it ignores SIGPIPE itself, it gives each one 100µs
  // to fail before writing INIT to it. Its fallback modules (sd_espeak-ng and
  // sd_dummy) aren't in guidepup's module directory, so when one fails slower
  // than that, the write killed it with SIGPIPE. Ignored, the write fails and
  // the module is skipped. Node's children always start with default signal
  // handling, so env ignores it before running Speech Dispatcher.
  const speechdProcess = spawn(
    "env",
    ["--ignore-signal=PIPE", "speech-dispatcher", ...args],
    {
      env: {
        ...process.env,
        GUIDEPUP_ORCA_SPEECH_SOCKET: guidepupSocketPath,
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  logProcessOutput(speechdProcess, "speechd");

  const address = `unix_socket:${speechdSocketPath}`;

  debug(`SPEECHD_ADDRESS=${address}`);

  try {
    await waitForCondition(
      () => {
        debug(`Polling for '${speechdSocketPath}' unix socket existence`);

        return isUnixSocket(speechdSocketPath);
      },
      { timeoutErrorMessage: ERR_ORCA_SPEECH_DISPATCHER_SERVICE_TIMEOUT },
    );
  } catch (error) {
    await terminateProcess(speechdProcess, "Speech Dispatcher");

    throw error;
  }

  return { address, guidepupSocketPath, process: speechdProcess };
}
