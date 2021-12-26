import { execFile } from "child_process";

const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;
const CSCRIPT = "cscript";

export function runVbsCode(vbsCode: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const child = execFile(
      CSCRIPT,
      [],
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

    child.stdin.write(vbsCode);
    child.stdin.end();
  });
}
