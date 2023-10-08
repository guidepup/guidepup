import { mkdirSync, unlinkSync } from "fs";
import { dirname } from "path";
import { spawn } from "child_process";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpegPath = require("ffmpeg-static");

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

  const screencapture = spawn(ffmpegPath, [
    "-f",
    "gdigrab",
    "-framerate",
    "60",
    "-i",
    "desktop",
    "-vcodec",
    "mpeg4",
    filepath,
  ]);

  return () => {
    screencapture.stdin.write("q");
  };
}
