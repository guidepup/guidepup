import { ChildProcess, spawn } from "child_process";
import { ERR_NVDA_CANNOT_BE_STARTED, ERR_NVDA_NOT_INSTALLED } from "../errors";
import { getNVDAInstallationPath } from "./getNVDAInstallationPath";
import { mockType } from "../../../test/mockType";
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
const mockChildProcess = {
  kill: jest.fn(),
};
const mockError = new Error("test-error");

describe("start", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when NVDA is not installed", () => {
    beforeEach(() => {
      mockType(getNVDAInstallationPath).mockResolvedValue(null);
    });

    it("should attempt to get the installation path", async () => {
      try {
        await start();
      } catch {
        // swallow
      }

      expect(getNVDAInstallationPath).toHaveBeenCalled();
    });

    it("should throw an error", async () => {
      expect(start).rejects.toThrowError(new Error(ERR_NVDA_NOT_INSTALLED));
    });
  });

  describe("when NVDA is installed", () => {
    beforeEach(() => {
      mockType(getNVDAInstallationPath).mockResolvedValue(mockInstallationPath);
    });

    describe("when starting NVDA is successful first attempt", () => {
      beforeEach(async () => {
        mockType(waitForRunning).mockResolvedValue();

        await start();
      });

      it("should spawn a NVDA command", () => {
        expect(spawn).toHaveBeenCalledWith(
          `"${mockInstallationPath}"`,
          [],
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

    describe("when starting NVDA throws an error first attempt", () => {
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
          [],
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

    describe("when starting NVDA times out first attempt but succeeds second attempt", () => {
      beforeEach(async () => {
        mockType(spawn).mockReturnValue(
          mockChildProcess as unknown as ChildProcess
        );
        mockType(waitForRunning).mockRejectedValueOnce(mockError);
        mockType(waitForRunning).mockResolvedValueOnce();

        await start();
      });

      it("should spawn a NVDA command", () => {
        expect(spawn).toHaveBeenNthCalledWith(
          1,
          `"${mockInstallationPath}"`,
          [],
          {
            shell: true,
            stdio: "ignore",
          }
        );
      });

      it("should wait for NVDA to be running", () => {
        expect(waitForRunning).toHaveBeenNthCalledWith(1);
      });

      it("should kill the child process", () => {
        expect(mockChildProcess.kill).toHaveBeenCalledWith("SIGKILL");
      });

      it("should attempt to spawn a NVDA command again", () => {
        expect(spawn).toHaveBeenNthCalledWith(
          2,
          `"${mockInstallationPath}"`,
          [],
          {
            shell: true,
            stdio: "ignore",
          }
        );
      });

      it("should wait for NVDA to be running again", () => {
        expect(waitForRunning).toHaveBeenNthCalledWith(2);
      });
    });

    describe("when starting NVDA times out on both attempts", () => {
      let error;

      beforeEach(async () => {
        mockType(spawn).mockReturnValue(
          mockChildProcess as unknown as ChildProcess
        );
        mockType(waitForRunning).mockRejectedValue(mockError);

        try {
          await start();
        } catch (e) {
          error = e;
        }
      });

      it("should spawn a NVDA command", () => {
        expect(spawn).toHaveBeenNthCalledWith(
          1,
          `"${mockInstallationPath}"`,
          [],
          {
            shell: true,
            stdio: "ignore",
          }
        );
      });

      it("should wait for NVDA to be running", () => {
        expect(waitForRunning).toHaveBeenNthCalledWith(1);
      });

      it("should kill the child process", () => {
        expect(mockChildProcess.kill).toHaveBeenCalledWith("SIGKILL");
      });

      it("should attempt to spawn a NVDA command again", () => {
        expect(spawn).toHaveBeenNthCalledWith(
          2,
          `"${mockInstallationPath}"`,
          [],
          {
            shell: true,
            stdio: "ignore",
          }
        );
      });

      it("should wait for NVDA to be running again", () => {
        expect(waitForRunning).toHaveBeenNthCalledWith(2);
      });

      it("should kill the child process", () => {
        expect(mockChildProcess.kill).toHaveBeenCalledWith("SIGKILL");
      });

      it("should throw the timeout error", () => {
        expect(error).toEqual(mockError);
      });
    });
  });
});
