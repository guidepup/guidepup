import { mkdirSync, unlinkSync } from "fs";
import { dirname } from "path";
import { spawn } from "child_process";

// TODO: add better handling for when permissions for screen recording haven't
// been provided so that the system permissions popup is avoided.

/**
 * [API Reference](https://www.guidepup.dev/docs/api/class-macos-record)
 *
 * Start a screen recording on MacOS.
 *
 * ```ts
 * import { macOSRecord } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Start the screen recording.
 *   const stopRecording = macOSRecord("./recordings/screenRecording.mov");
 *
 *   // ... perform some commands.
 *
 *   // Stop the screen recording.
 *   stopRecording();
 * })();
 * ```
 *
 * @param {string} filepath The file path to save the screen recording to.
 * @returns {Function} A function to stop the screen recording.
 */
export function record(filepath: string): () => void {
  mkdirSync(dirname(filepath), { recursive: true });

  try {
    unlinkSync(filepath);
  } catch {
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
