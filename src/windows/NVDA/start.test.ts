import { ChildProcess, spawn } from "child_process";
import { DEFAULT_NVDA_PATH } from "./constants";
import { ERR_NVDA_CANNOT_BE_STARTED } from "../errors";
import { mockType } from "../../../test/mockType";
import { start } from "./start";
import { waitForRunning } from "./waitForRunning";

jest.mock("child_process", () => ({
  spawn: jest.fn(),
}));
jest.mock("./waitForRunning", () => ({
  waitForRunning: jest.fn(),
}));

describe("start", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockType(waitForRunning).mockResolvedValue(null);
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
        `"${DEFAULT_NVDA_PATH}"`,
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
    const mockChild = { kill: jest.fn() as () => void };

    beforeEach(async () => {
      mockType(spawn).mockReturnValue(mockChild as ChildProcess);

      await start();
    });

    it("should spawn a NVDA command", () => {
      expect(spawn).toHaveBeenCalledWith(
        `"${DEFAULT_NVDA_PATH}"`,
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

    it("should kill the child process", () => {
      expect(mockChild.kill).toHaveBeenCalled();
    });
  });
});
