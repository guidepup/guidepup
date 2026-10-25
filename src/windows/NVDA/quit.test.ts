import {
  ERR_NVDA_NOT_INSTALLED,
  ERR_NVDA_QUIT,
  ERR_NVDA_QUIT_TIMEOUT,
} from "../errors";
import { DEFAULT_RUNNING_TIMEOUT } from "../../constants";
import { getNVDAInstallationPath } from "./getNVDAInstallationPath";
import { quit } from "./quit";
import { spawnSync } from "child_process";

type SpawnSyncResult = ReturnType<typeof spawnSync>;

jest.mock("./getNVDAInstallationPath", () => ({
  getNVDAInstallationPath: jest.fn(),
}));
jest.mock("child_process", () => ({
  spawnSync: jest.fn(),
}));

const mockInstallationPath = "test-installation-path";
const mockSpawnSyncOptions = {
  stdio: "ignore",
  timeout: DEFAULT_RUNNING_TIMEOUT,
};

describe("quit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when NVDA is not installed", () => {
    beforeEach(() => {
      jest.mocked(getNVDAInstallationPath).mockReturnValue(null);
    });

    it("should attempt to get the installation path", async () => {
      try {
        await quit();
      } catch {
        // swallow
      }

      expect(getNVDAInstallationPath).toHaveBeenCalled();
    });

    it("should throw an error", async () => {
      expect(quit).toThrow(new Error(ERR_NVDA_NOT_INSTALLED));
    });
  });

  describe("when NVDA is installed", () => {
    beforeEach(() => {
      jest
        .mocked(getNVDAInstallationPath)
        .mockReturnValue(mockInstallationPath);

      jest.mocked(spawnSync).mockReturnValue({ status: 0 } as SpawnSyncResult);
    });

    describe("when no error is thrown", () => {
      beforeEach(async () => {
        await quit();
      });

      it("should attempt to get the installation path", () => {
        expect(getNVDAInstallationPath).toHaveBeenCalled();
      });

      it("should run the nvda --quit command without a shell or stdio, with a timeout", () => {
        expect(spawnSync).toHaveBeenCalledWith(
          mockInstallationPath,
          ["--quit"],
          mockSpawnSyncOptions,
        );
      });
    });

    describe("when the NVDA installation path contains a space", () => {
      const mockInstallationPathWithSpace =
        "C:\\Users\\Test User\\AppData\\Local\\guidepup\\nvda\\all\\0.0.0\\extracted\\nvda.exe";

      beforeEach(async () => {
        jest
          .mocked(getNVDAInstallationPath)
          .mockReturnValue(mockInstallationPathWithSpace);

        await quit();
      });

      it("should pass the path through as a single unquoted argument", () => {
        expect(spawnSync).toHaveBeenCalledWith(
          mockInstallationPathWithSpace,
          ["--quit"],
          mockSpawnSyncOptions,
        );
      });

      it("should not run the nvda --quit command through a shell", () => {
        expect(jest.mocked(spawnSync).mock.calls[0][2]).not.toHaveProperty(
          "shell",
        );
      });
    });

    describe("when the nvda --quit command times out", () => {
      const mockTimeoutError = Object.assign(
        new Error("spawnSync test-installation-path ETIMEDOUT"),
        { code: "ETIMEDOUT" },
      );

      let error: unknown;

      beforeEach(() => {
        jest.mocked(spawnSync).mockReturnValue({
          error: mockTimeoutError,
        } as unknown as SpawnSyncResult);

        try {
          quit();
        } catch (e) {
          error = e;
        }
      });

      it("should throw a timeout error", () => {
        expect(error).toMatchObject({
          message: ERR_NVDA_QUIT_TIMEOUT,
          cause: mockTimeoutError,
        });
      });

      it("should keep the timeout error as the cause", () => {
        expect((error as Error).cause).toBe(mockTimeoutError);
      });
    });

    describe("when the nvda --quit command cannot be run", () => {
      const mockSpawnError = Object.assign(
        new Error("spawnSync test-installation-path ENOENT"),
        { code: "ENOENT" },
      );

      let error: unknown;

      beforeEach(() => {
        jest.mocked(spawnSync).mockReturnValue({
          error: mockSpawnError,
        } as unknown as SpawnSyncResult);

        try {
          quit();
        } catch (e) {
          error = e;
        }
      });

      it("should throw a wrapped error", () => {
        expect(error).toMatchObject({
          message: ERR_NVDA_QUIT,
          cause: mockSpawnError,
        });
      });

      it("should keep the spawn error as the cause", () => {
        expect((error as Error).cause).toBe(mockSpawnError);
      });
    });

    describe("when quitting throws an error", () => {
      const mockError = new Error("test-error");

      let error: unknown;

      beforeEach(async () => {
        jest.mocked(spawnSync).mockImplementation(() => {
          throw mockError;
        });

        try {
          await quit();
        } catch (e) {
          error = e;
        }
      });

      it("should attempt to get the installation path", () => {
        expect(getNVDAInstallationPath).toHaveBeenCalled();
      });

      it("should run the nvda --quit command without a shell or stdio, with a timeout", () => {
        expect(spawnSync).toHaveBeenCalledWith(
          mockInstallationPath,
          ["--quit"],
          mockSpawnSyncOptions,
        );
      });

      it("should throw a wrapped error", () => {
        expect(error).toMatchObject({
          message: ERR_NVDA_QUIT,
          cause: mockError,
        });
      });
    });
  });
});
