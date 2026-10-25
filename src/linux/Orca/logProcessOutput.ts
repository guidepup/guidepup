import { base } from "../../debug";
import type { ChildProcess } from "node:child_process";

const debug = base.extend("logProcessOutput");

/**
 * Log a spawned process's output, errors and exit, prefixed with its name.
 */
export function logProcessOutput(child: ChildProcess, name: string): void {
  const log = (data: Buffer) => {
    debug(`[${name}] ${data.toString().trimEnd()}`);
  };

  child.stdout?.on("data", log);
  child.stderr?.on("data", log);

  child.on("error", (error) => {
    debug(`[${name}] process error: ${error.message}`);
  });

  child.on("exit", (code, signal) => {
    debug(`[${name}] exited with code=${code}, signal=${signal}`);
  });
}
