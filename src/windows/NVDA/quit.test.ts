import { ERR_NVDA_NOT_INSTALLED, ERR_NVDA_QUIT } from "../errors";
import { getNVDAInstallationPath } from "./getNVDAInstallationPath";
import { quit } from "./quit";
import { spawnSync } from "child_process";

jest.mock("./getNVDAInstallationPath", () => ({
  getNVDAInstallationPath: jest.fn(),
}));
jest.mock("child_process", () => ({
  spawnSync: jest.fn(),
}));

const mockInstallationPath = "test-installation-path";

describe("quit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when NVDA is not installed", () => {
    beforeEach(() => {
      jest.mocked(getNVDAInstallationPath).mockResolvedValue(null);
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
      expect(quit).rejects.toThrow(new Error(ERR_NVDA_NOT_INSTALLED));
    });
  });

  describe("when NVDA is installed", () => {
    beforeEach(() => {
      jest
        .mocked(getNVDAInstallationPath)
        .mockResolvedValue(mockInstallationPath);
    });

    describe("when no error is thrown", () => {
      beforeEach(async () => {
        await quit();
      });

      it("should attempt to get the installation path", () => {
        expect(getNVDAInstallationPath).toHaveBeenCalled();
      });

      it("should spawn a shell to run the nvda --quit command without stdio", () => {
        expect(spawnSync).toHaveBeenCalledWith(
          `"${mockInstallationPath}"`,
          ["--quit"],
          { shell: true, stdio: "ignore" }
        );
      });
    });

    describe("when quitting throws an error", () => {
      const mockError = new Error("test-error");

      let error;

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

      it("should spawn a shell to run the nvda --quit command without stdio", () => {
        expect(spawnSync).toHaveBeenCalledWith(
          `"${mockInstallationPath}"`,
          ["--quit"],
          { shell: true, stdio: "ignore" }
        );
      });

      it("should throw a wrapped error", () => {
        expect(error).toEqual(
          new Error(`${ERR_NVDA_QUIT}\n${mockError.message}`)
        );
      });
    });
  });
});
