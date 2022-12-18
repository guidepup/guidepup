import { ERR_NVDA_CANNOT_BE_STARTED } from "../errors";
import { getNVDAInstallationPath } from "./getNVDAInstallationPath";
import { mockType } from "../../../test/mockType";
import { spawn } from "child_process";
import { start } from "./start";
import { waitForRunning } from "./waitForRunning";

jest.mock("./getNVDAInstallationPath", () => ({
  getNVDAInstallationPath: jest.fn(),
}));
jest.mock("child_process", () => ({
  spawn: jest.fn(),
}));
jest.mock("./waitForRunning", () => ({
  waitForRunning: jest.fn(),
}));

const mockInstallationPath = "test-installation-path";

describe("start", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockType(waitForRunning).mockResolvedValue();

    mockType(getNVDAInstallationPath).mockResolvedValue(mockInstallationPath);
  });

  describe("when starting NVDA throws an error", () => {
    const mockError = new Error("test-error");

    let error;

    beforeEach(async () => {
      mockType(spawn).mockImplementation(() => {
        throw mockError;
      });

      try {
        await start();
      } catch (e) {
        error = e;
      }
    });

    it("should spawn a NVDA command", () => {
      expect(spawn).toHaveBeenCalledWith(
        `"${mockInstallationPath}"`,
        ["--minimal"],
        {
          shell: true,
          stdio: "ignore",
        }
      );
    });

    it("should throw a wrapped error", () => {
      expect(error).toEqual(
        new Error(`${ERR_NVDA_CANNOT_BE_STARTED}\n${mockError.message}`)
      );
    });
  });

  describe("when starting NVDA is successful", () => {
    beforeEach(async () => {
      await start();
    });

    it("should spawn a NVDA command", () => {
      expect(spawn).toHaveBeenCalledWith(
        `"${mockInstallationPath}"`,
        ["--minimal"],
        {
          shell: true,
          stdio: "ignore",
        }
      );
    });

    it("should wait for NVDA to be running", () => {
      expect(waitForRunning).toHaveBeenCalled();
    });
  });
});
