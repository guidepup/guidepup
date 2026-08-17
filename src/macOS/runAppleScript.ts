import { DEFAULT_MAX_BUFFER, DEFAULT_TIMEOUT } from "../constants";
import { base } from "../debug";
import { execFile } from "child_process";

const debug = base.extend("osascript");

export async function runAppleScript<T = string | void>(
  script: string,
  { timeout = DEFAULT_TIMEOUT } = { timeout: DEFAULT_TIMEOUT },
): Promise<T> {
  const appleScriptTimeoutMs = Math.max(1, Math.ceil(timeout / 1000));

  const scriptWithTimeout = `with timeout of ${appleScriptTimeoutMs} seconds\n${script}\nend timeout`;

  debug("execute", { scriptWithTimeout });

  return (await new Promise<string | void>((resolve, reject) => {
    const child = execFile(
      "/usr/bin/osascript",
      [],
      {
        maxBuffer: DEFAULT_MAX_BUFFER,
        timeout,
      },
      (error, stdout) => {
        if (error) {
          debug("failed", { error });

          return reject(error);
        }

        debug("completed");

        if (!stdout) {
          return resolve();
        } else {
          return resolve(stdout.trim());
        }
      },
    );

    debug("process started", { pid: child.pid });

    child.stdin.write(scriptWithTimeout);
    child.stdin.end();

    debug("script written");
  })) as unknown as T;
}
