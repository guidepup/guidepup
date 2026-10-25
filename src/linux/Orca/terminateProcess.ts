import { base } from "../../debug";
import type { ChildProcess } from "node:child_process";

const debug = base.extend("terminateProcess");

const PROCESS_EXIT_TIMEOUT = 5_000;

/**
 * Send SIGTERM and wait for the process to exit, falling back to SIGKILL.
 */
export async function terminateProcess(
  child: ChildProcess | null,
  name: string,
): Promise<void> {
  if (!child || child.exitCode !== null || child.signalCode !== null) {
    return;
  }

  debug(`Terminating ${name} process...`);

  let onExit: (() => void) | undefined;

  const exited = new Promise<void>((resolve) => {
    onExit = resolve;

    child.once("exit", onExit);
  });

  let timer: NodeJS.Timeout | undefined;

  try {
    if (!child.kill("SIGTERM")) {
      debug(`Could not send SIGTERM to ${name} process`);
    }

    await Promise.race([
      exited,
      new Promise<void>((resolve, reject) => {
        timer = setTimeout(() => {
          debug(`${name} did not exit after SIGTERM, sending SIGKILL`);

          if (!child.kill("SIGKILL")) {
            debug(`Could not send SIGKILL to ${name} process`);
          }

          timer = setTimeout(() => {
            if (child.exitCode !== null || child.signalCode !== null) {
              resolve();

              return;
            }

            reject(
              new Error(
                `Failed to terminate ${name} process within ${PROCESS_EXIT_TIMEOUT * 2}ms`,
              ),
            );
          }, PROCESS_EXIT_TIMEOUT);
        }, PROCESS_EXIT_TIMEOUT);
      }),
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }

    child.removeListener("exit", onExit);
  }
}
