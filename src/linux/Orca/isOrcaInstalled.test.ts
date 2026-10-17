import { getOrcaInstallationPath } from "./getOrcaInstallationPath";
import { isOrcaInstalled } from "./isOrcaInstalled";

jest.mock("./getOrcaInstallationPath", () => ({
  getOrcaInstallationPath: jest.fn(),
}));

describe("isOrcaInstalled", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when getting the installation path throws an error", () => {
    beforeEach(() => {
      jest.mocked(getOrcaInstallationPath).mockImplementation(() => {
        throw new Error("test-error");
      });
    });

    it("should return false", () => {
      expect(isOrcaInstalled()).toBe(false);
    });
  });

  describe("when Orca is installed", () => {
    beforeEach(() => {
      jest
        .mocked(getOrcaInstallationPath)
        .mockReturnValue("test-installation-path");
    });

    it("should return true", () => {
      expect(isOrcaInstalled()).toBe(true);
    });
  });
});
