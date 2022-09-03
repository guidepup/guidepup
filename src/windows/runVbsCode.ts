import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import { execFile } from "child_process";

const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;
const CSCRIPT = "cscript";

const withTempFile = async (fn) =>
  await withTempDir((dir: string) => fn(path.join(dir, "script.vbs")));

const withTempDir = async (fn) => {
  const dir = await fs.mkdtemp((await fs.realpath(os.tmpdir())) + path.sep);

  try {
    return await fn(dir);
  } finally {
    fs.rm(dir, { recursive: true });
  }
};

export async function runVbsCode(vbsCode: string): Promise<string> {
  return await withTempFile(async (filePath: string) => {
    await fs.writeFile(filePath, vbsCode);

    return new Promise<string>((resolve, reject) => {
      const child = execFile(
        CSCRIPT,
        [filePath],
        {
          maxBuffer: DEFAULT_MAX_BUFFER,
        },
        (err, stdout = "", stderr = "") => {
          if (err) {
            return reject(err);
          }

          if (stderr) {
            console.error(stderr);
          }

          resolve(stdout.trim());
        }
      );

      child.stdin.end();
    });
  });
}
