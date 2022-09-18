import { spawn } from "child_process";

/**
 * Start a screen recording.
 *
 * @param {string} filepath The file path to save the screen recording to.
 * @returns {Function} A function to abort the screen recording.
 */
export function record(
  filepath: string
): typeof AbortController.prototype.abort {
  const abortController = new AbortController();

  spawn("/usr/sbin/screencapture", ["-v", "-C", "-k", "-T0", "-g", filepath], {
    signal: abortController.signal,
  });

  return () => abortController.abort();
}
