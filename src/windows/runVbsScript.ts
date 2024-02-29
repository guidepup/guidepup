import { join, sep } from "path";
import { execFile } from "child_process";
import { promises } from "fs";
import { tmpdir } from "os";

const { mkdtemp, realpath, rm, writeFile } = promises;

const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;
const CSCRIPT = "cscript";

const withTempFile = async (fn) =>
  await withTempDir((dir: string) => fn(join(dir, "script.vbs")));

const withTempDir = async (fn) => {
  const dir = await mkdtemp((await realpath(tmpdir())) + sep);

  try {
    return await fn(dir);
  } finally {
    await rm(dir, { recursive: true });
  }
};

export async function runVbsScript(script: string): Promise<string> {
  return await withTempFile(async (filePath: string) => {
    await writeFile(filePath, script);

    return new Promise<string | void>((resolve, reject) => {
      const child = execFile(
        CSCRIPT,
        [filePath],
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

      child.stdin.end();
    });
  });
}
