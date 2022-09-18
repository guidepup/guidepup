import { execSync, spawn } from "child_process";
import { dirname } from "path";
import { unlinkSync } from "fs";

/**
 * Start a screen recording.
 *
 * @param {string} filepath The file path to save the screen recording to.
 * @returns {Function} A function to stop the screen recording.
 */
export function record(filepath: string): () => void {
  execSync(`mkdir -p ${dirname(filepath)}`);
  unlinkSync(filepath);

  const screencapture = spawn("/usr/sbin/screencapture", [
    "-v",
    "-C",
    "-k",
    "-T0",
    "-g",
    filepath,
  ]);

  return () => {
    screencapture.stdin.write("q");
  };
}
