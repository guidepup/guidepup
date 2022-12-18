import { ERR_NVDA_QUIT } from "../errors";
import { getNVDAInstallationPath } from "./getNVDAInstallationPath";
import { mockType } from "../../../test/mockType";
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
  describe("when no error is thrown", () => {
    beforeEach(async () => {
      jest.clearAllMocks();

      mockType(getNVDAInstallationPath).mockResolvedValue(mockInstallationPath);

      await quit();
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
      mockType(spawnSync).mockImplementation(() => {
        throw mockError;
      });

      try {
        await quit();
      } catch (e) {
        error = e;
      }
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
