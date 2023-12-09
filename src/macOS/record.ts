import { mkdirSync, unlinkSync } from "fs";
import { dirname } from "path";
import { spawn } from "child_process";

/**
 * Start a screen recording.
 *
 * @param {string} filepath The file path to save the screen recording to.
 * @returns {Function} A function to stop the screen recording.
 */
export function record(filepath: string): () => void {
  mkdirSync(dirname(filepath), { recursive: true });

  try {
    unlinkSync(filepath);
  } catch (_) {
    // file doesn't exist.
  }

  const screencapture = spawn("/usr/sbin/screencapture", [
    "-v",
    "-C",
    "-k",
    "-T0",
    "-g",
    filepath,
  ]);

  screencapture.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  screencapture.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  screencapture.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  return () => {
    screencapture.stdin.write("q");
  };
}
