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

  return () => {
    screencapture.stdin.write("q");
  };
}
