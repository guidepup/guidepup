import { execFile } from "child_process";
import { DEFAULT_TIMEOUT, DEFAULT_MAX_BUFFER } from "../constants";

export async function runAppleScript<T = string | void>(
  script: string,
  { timeout = DEFAULT_TIMEOUT } = { timeout: DEFAULT_TIMEOUT }
): Promise<T> {
  const scriptWithTimeout = `with timeout of ${timeout} seconds\n${script}\nend timeout`;

  return (await new Promise<string | void>((resolve, reject) => {
    const child = execFile(
      "/usr/bin/osascript",
      [],
      {
        maxBuffer: DEFAULT_MAX_BUFFER,
      },
      (e, stdout) => {
        if (e) {
          return reject(e);
        }

        if (!stdout) {
          return resolve();
        } else {
          return resolve(stdout.trim());
        }
      }
    );

    child.stdin.write(scriptWithTimeout);
    child.stdin.end();
  })) as unknown as T;
}
