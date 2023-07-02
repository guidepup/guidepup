import { getNVDAInstallationPath } from "./getNVDAInstallationPath";
import { isNVDAInstalled } from "./isNVDAInstalled";

jest.mock("./getNVDAInstallationPath", () => ({
  getNVDAInstallationPath: jest.fn(),
}));

describe("isNVDAInstalled", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when getting the installation path throws an error", () => {
    beforeEach(() => {
      jest.mocked(getNVDAInstallationPath).mockImplementation(() => {
        throw new Error("test-error");
      });
    });

    it("should return false", async () => {
      await expect(isNVDAInstalled()).resolves.toBe(false);
    });
  });

  describe("when NVDA is installed", () => {
    beforeEach(() => {
      jest
        .mocked(getNVDAInstallationPath)
        .mockResolvedValue("test-installation-path");
    });

    it("should return true", async () => {
      await expect(isNVDAInstalled()).resolves.toBe(true);
    });
  });

  describe("when NVDA is not installed", () => {
    beforeEach(() => {
      jest.mocked(getNVDAInstallationPath).mockResolvedValue(null);
    });

    it("should return false", async () => {
      await expect(isNVDAInstalled()).resolves.toBe(false);
    });
  });
});
