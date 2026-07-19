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

    it("should return false", () => {
      expect(isNVDAInstalled()).toBe(false);
    });
  });

  describe("when NVDA is installed", () => {
    beforeEach(() => {
      jest
        .mocked(getNVDAInstallationPath)
        .mockReturnValue("test-installation-path");
    });

    it("should return true", () => {
      expect(isNVDAInstalled()).toBe(true);
    });
  });

  describe("when NVDA is not installed", () => {
    beforeEach(() => {
      jest.mocked(getNVDAInstallationPath).mockReturnValue(null);
    });

    it("should return false", () => {
      expect(isNVDAInstalled()).toBe(false);
    });
  });
});
