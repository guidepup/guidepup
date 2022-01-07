import { execFile } from "child_process";

const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;
const DEFAULT_TIMEOUT = 5;

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
      (e, stdout, stderr) => {
        if (e) {
          return reject(e);
        }

        if (stderr) {
          console.error(stderr);
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
