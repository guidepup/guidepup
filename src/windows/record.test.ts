import { ChildProcess, spawn } from "child_process";
import { mkdirSync, unlinkSync } from "fs";
import { join } from "path";
import { record } from "./record";

jest.mock("ffmpeg-static", () => "test-ffmpeg");
jest.mock("child_process", () => ({
  spawn: jest.fn(),
}));
jest.mock("fs", () => ({
  mkdirSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

const mockDirectory = "test-directory";
const mockFilepath = join(mockDirectory, "test-filepath.ext");

const mockProcess = {
  stdin: {
    write: jest.fn(),
  },
};

describe("record", () => {
  let stopRecording;

  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(spawn).mockReturnValue(mockProcess as unknown as ChildProcess);

    stopRecording = record(mockFilepath);
  });

  it("should create the directory path", () => {
    expect(mkdirSync).toHaveBeenCalledWith(mockDirectory, { recursive: true });
  });

  it("should delete the file if already exists (to eliminate dealing with overwrite options)", () => {
    expect(unlinkSync).toHaveBeenCalledWith(mockFilepath);
  });

  it("should spawn an ffmpeg child process for recording", () => {
    expect(spawn).toHaveBeenCalledWith("test-ffmpeg", [
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
      mockFilepath,
    ]);
  });

  it("should return a function to stop the ffmpeg process", () => {
    stopRecording();

    expect(mockProcess.stdin.write).toHaveBeenCalledWith("q");
  });
});
