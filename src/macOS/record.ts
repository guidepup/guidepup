import { mkdirSync, unlinkSync } from "fs";
import { dirname } from "path";
import { spawn } from "child_process";

// TODO: add better handling for when permissions for screen recording haven't
// been provided so that the system permissions popup is avoided.

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
