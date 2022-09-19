import { execSync, spawn } from "child_process";
import { dirname } from "path";
import { getDimensions } from "./getDimensions";
import { unlinkSync } from "fs";

/**
 * Start a screen recording.
 *
 * @param {string} filepath The file path to save the screen recording to.
 * @returns {Function} A function to stop the screen recording.
 */
export async function record(filepath: string): Promise<() => void> {
  execSync(`mkdir -p ${dirname(filepath)}`);

  try {
    unlinkSync(filepath);
  } catch (_) {
    // file doesn't exist.
  }

  const dimensions = (await getDimensions()).replaceAll(" ", "");

  const screencapture = spawn("/usr/sbin/screencapture", [
    "-v",
    "-C",
    "-k",
    "-T0",
    "-g",
    `-R${dimensions}`,
    filepath,
  ]);

  return () => {
    screencapture.stdin.write("q");
  };
}
