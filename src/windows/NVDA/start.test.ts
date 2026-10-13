import { ChildProcess, spawn } from "child_process";
import { ERR_NVDA_CANNOT_BE_STARTED, ERR_NVDA_NOT_INSTALLED } from "../errors";
import { getNVDAInstallationPath } from "./getNVDAInstallationPath";
import { resolveSessionUserConfigPath } from "./config";
import { start } from "./start";
import { waitForRunning } from "./waitForRunning";

jest.mock("./getNVDAInstallationPath", () => ({
  getNVDAInstallationPath: jest.fn(),
}));
jest.mock("./config", () => ({
  resolveSessionUserConfigPath: jest.fn(),
}));
jest.mock("child_process", () => ({
  spawn: jest.fn(),
}));
jest.mock("./waitForRunning", () => ({
  waitForRunning: jest.fn(),
}));

const mockInstallationPath = "test-installation-path";
const mockSessionUserConfigPath = "test-session-user-config-path";
const mockChildProcess = {
  kill: jest.fn(),
  off: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
};
const mockError = new Error("test-error");

describe("start", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when NVDA is not installed", () => {
    beforeEach(() => {
      jest.mocked(getNVDAInstallationPath).mockReturnValue(null);
      jest.mocked(resolveSessionUserConfigPath).mockReturnValue("");
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
      expect(start).rejects.toThrow(new Error(ERR_NVDA_NOT_INSTALLED));
    });
  });

  describe("when NVDA is installed", () => {
    beforeEach(() => {
      jest
        .mocked(getNVDAInstallationPath)
        .mockReturnValue(mockInstallationPath);

      jest
        .mocked(resolveSessionUserConfigPath)
        .mockReturnValue(mockSessionUserConfigPath);

      jest
        .mocked(spawn)
        .mockReturnValue(mockChildProcess as unknown as ChildProcess);
    });

    describe("when starting NVDA is successful first attempt", () => {
      beforeEach(async () => {
        jest.mocked(waitForRunning).mockResolvedValue();

        await start();
      });

      it("should spawn a NVDA command", () => {
        expect(spawn).toHaveBeenCalledWith(
          mockInstallationPath,
          ["--config-path", mockSessionUserConfigPath],
          {
            stdio: "ignore",
          },
        );
      });

      it("should not spawn NVDA through a shell", () => {
        expect(jest.mocked(spawn).mock.calls[0][2]).not.toHaveProperty("shell");
      });

      it("should listen for a spawn error while NVDA starts", () => {
        expect(mockChildProcess.once).toHaveBeenCalledWith(
          "error",
          expect.any(Function),
        );
      });

      it("should wait for NVDA to be running", () => {
        expect(waitForRunning).toHaveBeenCalled();
      });

      it("should stop listening for a spawn error once NVDA has started", () => {
        expect(mockChildProcess.off).toHaveBeenCalledWith(
          "error",
          jest.mocked(mockChildProcess.once).mock.calls[0][1],
        );
      });

      it("should keep a no-op listener for later NVDA process errors", () => {
        expect(mockChildProcess.on).toHaveBeenCalledWith(
          "error",
          expect.any(Function),
        );

        const [, listener] = jest.mocked(mockChildProcess.on).mock.calls[0];

        expect(() => listener(new Error("later-error"))).not.toThrow();
      });
    });

    describe("when the NVDA installation path contains a space", () => {
      const mockInstallationPathWithSpace =
        "C:\\Users\\Test User\\AppData\\Local\\guidepup\\nvda\\all\\0.0.0\\extracted\\nvda.exe";
      const mockSessionUserConfigPathWithSpace =
        "C:\\Users\\Test User\\AppData\\Local\\guidepup\\nvda\\all\\0.0.0\\sessionUserConfig";

      beforeEach(async () => {
        jest
          .mocked(getNVDAInstallationPath)
          .mockReturnValue(mockInstallationPathWithSpace);
        jest
          .mocked(resolveSessionUserConfigPath)
          .mockReturnValue(mockSessionUserConfigPathWithSpace);
        jest.mocked(waitForRunning).mockResolvedValue();

        await start();
      });

      it("should pass each path through as a single unquoted argument", () => {
        expect(spawn).toHaveBeenCalledWith(
          mockInstallationPathWithSpace,
          ["--config-path", mockSessionUserConfigPathWithSpace],
          {
            stdio: "ignore",
          },
        );
      });

      it("should not spawn NVDA through a shell", () => {
        expect(jest.mocked(spawn).mock.calls[0][2]).not.toHaveProperty("shell");
      });
    });

    describe("when starting NVDA throws an error first attempt", () => {
      let error: unknown;

      beforeEach(async () => {
        jest.mocked(spawn).mockImplementation(() => {
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
          mockInstallationPath,
          ["--config-path", mockSessionUserConfigPath],
          {
            stdio: "ignore",
          },
        );
      });

      it("should throw a wrapped error", () => {
        expect(error).toEqual(
          new Error(`${ERR_NVDA_CANNOT_BE_STARTED}\n${mockError.message}`),
        );
      });
    });

    describe("when starting NVDA times out first attempt but succeeds second attempt", () => {
      beforeEach(async () => {
        jest
          .mocked(spawn)
          .mockReturnValue(mockChildProcess as unknown as ChildProcess);
        jest.mocked(waitForRunning).mockRejectedValueOnce(mockError);
        jest.mocked(waitForRunning).mockResolvedValueOnce();

        await start();
      });

      it("should spawn a NVDA command", () => {
        expect(spawn).toHaveBeenNthCalledWith(
          1,
          mockInstallationPath,
          ["--config-path", mockSessionUserConfigPath],
          {
            stdio: "ignore",
          },
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
          mockInstallationPath,
          ["--config-path", mockSessionUserConfigPath],
          {
            stdio: "ignore",
          },
        );
      });

      it("should wait for NVDA to be running again", () => {
        expect(waitForRunning).toHaveBeenNthCalledWith(2);
      });
    });

    describe("when starting NVDA times out on both attempts", () => {
      let error: unknown;

      beforeEach(async () => {
        jest
          .mocked(spawn)
          .mockReturnValue(mockChildProcess as unknown as ChildProcess);
        jest.mocked(waitForRunning).mockRejectedValue(mockError);

        try {
          await start();
        } catch (e) {
          error = e;
        }
      });

      it("should spawn a NVDA command", () => {
        expect(spawn).toHaveBeenNthCalledWith(
          1,
          mockInstallationPath,
          ["--config-path", mockSessionUserConfigPath],
          {
            stdio: "ignore",
          },
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
          mockInstallationPath,
          ["--config-path", mockSessionUserConfigPath],
          {
            stdio: "ignore",
          },
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

    describe("when the NVDA process fails to spawn on both attempts", () => {
      const mockSpawnError = new Error("spawn test-installation-path ENOENT");
      const mockFailingChildProcess = {
        kill: jest.fn(),
        off: jest.fn(),
        on: jest.fn(),
        once: jest.fn((event: string, listener: (e: Error) => void) => {
          if (event === "error") {
            listener(mockSpawnError);
          }
        }),
      };
      let error: unknown;

      beforeEach(async () => {
        jest
          .mocked(spawn)
          .mockReturnValue(mockFailingChildProcess as unknown as ChildProcess);
        // NVDA never starts, so only the spawn error can end the wait.
        jest.mocked(waitForRunning).mockReturnValue(new Promise(() => {}));

        try {
          await start();
        } catch (e) {
          error = e;
        }
      });

      it("should attempt to spawn a NVDA command twice", () => {
        expect(spawn).toHaveBeenCalledTimes(2);
      });

      it("should kill the child process", () => {
        expect(mockFailingChildProcess.kill).toHaveBeenCalledWith("SIGKILL");
      });

      it("should keep a no-op listener for later NVDA process errors", () => {
        expect(mockFailingChildProcess.on).toHaveBeenCalledWith(
          "error",
          expect.any(Function),
        );
      });

      it("should throw the spawn error without waiting for the timeout", () => {
        expect(error).toBe(mockSpawnError);
      });
    });
  });
});
