import { ChildProcess, execSync, spawn } from "child_process";
import { getDimensions } from "./getDimensions";
import { join } from "path";
import { mockType } from "../../test/mockType";
import { record } from "./record";
import { unlinkSync } from "fs";

jest.mock("child_process", () => ({
  execSync: jest.fn(),
  spawn: jest.fn(),
}));
jest.mock("fs", () => ({
  unlinkSync: jest.fn(),
}));
jest.mock("./getDimensions", () => ({
  getDimensions: jest.fn(),
}));

const mockDirectory = "test-directory";
const mockFilepath = join(mockDirectory, "test-filepath.ext");
const mockDimensions = "test-dimensions";

const mockProcess = {
  stdin: {
    write: jest.fn(),
  },
};

describe("record", () => {
  let stopRecording;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockType(spawn).mockReturnValue(mockProcess as unknown as ChildProcess);
    mockType(getDimensions).mockResolvedValue(mockDimensions);

    stopRecording = await record(mockFilepath);
  });

  it("should create the directory path", () => {
    expect(execSync).toHaveBeenCalledWith(`mkdir -p ${mockDirectory}`);
  });

  it("should delete the file if already exists (because the screencapture command won't overwrite)", () => {
    expect(unlinkSync).toHaveBeenCalledWith(mockFilepath);
  });

  it("should get the screen dimensions", () => {
    expect(getDimensions).toHaveBeenCalled();
  });

  it("should spawn a screencapture child process for recording", () => {
    expect(spawn).toHaveBeenCalledWith("/usr/sbin/screencapture", [
      "-v",
      "-C",
      "-k",
      "-T0",
      "-g",
      `-R${mockDimensions}`,
      mockFilepath,
    ]);
  });

  it("should return a function to stop the screencapture process", () => {
    stopRecording();

    expect(mockProcess.stdin.write).toHaveBeenCalledWith("q");
  });
});
