import { execFile, type ExecFileException } from "child_process";
import { DEFAULT_RUNNING_TIMEOUT } from "../../constants";
import { ERR_NVDA_NOT_INSTALLED } from "../errors";
import { getGuidepupNVDAInstallationPath } from "./getGuidepupNVDAInstallationPath";
import { isAnyNVDARunning } from "./isAnyNVDARunning";

jest.mock("./getGuidepupNVDAInstallationPath", () => ({
  getGuidepupNVDAInstallationPath: jest.fn(),
}));
jest.mock("child_process", () => ({
  execFile: jest.fn(),
}));

const mockInstallationPath = "test-installation-path";

const mockExecFileResult = (error: Partial<ExecFileException> | null) => {
  jest.mocked(execFile).mockImplementation(((_file, _args, _options, callback) => {
    callback(error, "", "");
  }) as typeof execFile);
};

describe("isAnyNVDARunning", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when NVDA is not installed", () => {
    beforeEach(() => {
      jest.mocked(getGuidepupNVDAInstallationPath).mockReturnValue(null);
    });

    it("should throw an error", async () => {
      await expect(isAnyNVDARunning()).rejects.toThrow(
        new Error(ERR_NVDA_NOT_INSTALLED),
      );
    });

    it("should not run NVDA", async () => {
      await isAnyNVDARunning().catch(() => {});

      expect(execFile).not.toHaveBeenCalled();
    });
  });

  describe("when NVDA is installed", () => {
    beforeEach(() => {
      jest
        .mocked(getGuidepupNVDAInstallationPath)
        .mockReturnValue(mockInstallationPath);
    });

    it("should run the nvda --check-running command without a shell, with a timeout", async () => {
      mockExecFileResult(null);

      await isAnyNVDARunning();

      expect(execFile).toHaveBeenCalledWith(
        mockInstallationPath,
        ["--check-running"],
        { timeout: DEFAULT_RUNNING_TIMEOUT },
        expect.any(Function),
      );
    });

    describe("when the command exits with 0", () => {
      it("should resolve true", async () => {
        mockExecFileResult(null);

        await expect(isAnyNVDARunning()).resolves.toBe(true);
      });
    });

    describe("when the command exits with 1", () => {
      it("should resolve false", async () => {
        mockExecFileResult({ code: 1 });

        await expect(isAnyNVDARunning()).resolves.toBe(false);
      });
    });

    describe("when the command fails in another way", () => {
      it("should reject with the error", async () => {
        const mockError = Object.assign(new Error("test-error"), {
          code: "ENOENT",
        });

        mockExecFileResult(mockError);

        await expect(isAnyNVDARunning()).rejects.toBe(mockError);
      });
    });
  });
});
