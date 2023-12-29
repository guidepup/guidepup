import { mkdirSync, unlinkSync } from "fs";
import { dirname } from "path";
import { spawn } from "child_process";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpegPath = require("ffmpeg-static");

/**
 * [API Reference](https://www.guidepup.dev/docs/api/class-windows-record)
 *
 * Start a screen recording on Windows.
 *
 * ```ts
 * import { windowsRecord } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Start the screen recording.
 *   const stopRecording = windowsRecord("./recordings/screenRecording.mp4");
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

  const screencapture = spawn(ffmpegPath, [
    "-f",
    "gdigrab",
    "-framerate",
    "60",
    "-i",
    "desktop",
    "-pix_fmt",
    "yuv420p",
    "-vcodec",
    "mpeg4",
    filepath,
  ]);

  return () => {
    screencapture.stdin.write("q");
  };
}
