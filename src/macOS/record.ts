import { execSync, spawn } from "child_process";
import { dirname } from "path";

/**
 * Start a screen recording.
 *
 * @param {string} filepath The file path to save the screen recording to.
 * @returns {Function} A function to abort the screen recording.
 */
export function record(
  filepath: string
): typeof AbortController.prototype.abort {
  execSync(`mkdir -p ${dirname(filepath)}`);

  const abortController = new AbortController();

  const screencapture = spawn(
    "/usr/sbin/screencapture",
    ["-v", "-C", "-k", "-T0", "-g", filepath],
    {
      detached: true,
      signal: abortController.signal,
    }
  );

  screencapture.on("error", (err) => {
    if (err.name === "AbortError") {
      return;
    }

    throw err;
  });

  return () => abortController.abort();
}
