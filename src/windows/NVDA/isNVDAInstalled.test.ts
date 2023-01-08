import { getNVDAInstallationPath } from "./getNVDAInstallationPath";
import { isNVDAInstalled } from "./isNvdaInstalled";
import { mockType } from "../../../test/mockType";

jest.mock("./getNVDAInstallationPath", () => ({
  getNVDAInstallationPath: jest.fn(),
}));

describe("isNvdaInstalled", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when getting the installation path throws an error", () => {
    beforeEach(() => {
      mockType(getNVDAInstallationPath).mockImplementation(() => {
        throw new Error("test-error");
      });
    });

    it("should return false", async () => {
      await expect(isNVDAInstalled()).resolves.toBe(false);
    });
  });

  describe("when NVDA is installed", () => {
    beforeEach(() => {
      mockType(getNVDAInstallationPath).mockResolvedValue(
        "test-installation-path"
      );
    });

    it("should return true", async () => {
      await expect(isNVDAInstalled()).resolves.toBe(true);
    });
  });

  describe("when NVDA is not installed", () => {
    beforeEach(() => {
      mockType(getNVDAInstallationPath).mockResolvedValue(null);
    });

    it("should return false", async () => {
      await expect(isNVDAInstalled()).resolves.toBe(false);
    });
  });
});
