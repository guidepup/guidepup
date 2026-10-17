import { ERR_ORCA_FAILED_TO_LOAD_GUIDEPUP_SETTINGS } from "../../errors";
import { execFileSync } from "node:child_process";
import { getOrcaInstallationPath } from "../getOrcaInstallationPath";
import { join } from "node:path";
import { loadGuidepupSettings } from "./loadGuidepupSettings";
import { ORCA_GUIDEPUP_DCONF_PATH_PREFIX } from "./constants";
import { readFileSync } from "node:fs";
import { resetGuidepupSettings } from "./resetGuidepupSettings";

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
}));
jest.mock("node:fs", () => ({
  readFileSync: jest.fn(),
}));
jest.mock("../getOrcaInstallationPath", () => ({
  getOrcaInstallationPath: jest.fn(),
}));
jest.mock("./resetGuidepupSettings", () => ({
  resetGuidepupSettings: jest.fn(),
}));

const mockInstallationPath = "test-installation-path";
const mockDefaultSettingsPath = join(mockInstallationPath, "default.ini");
const mockGuidepupSettingsPath = join(mockInstallationPath, "guidepup.ini");
const mockDefaultSettings = "test-default-settings";
const mockGuidepupSettings = "test-guidepup-settings";
const stubError = new Error("test-error");

const expectLoadError = () =>
  expect(() => loadGuidepupSettings()).toThrow(
    expect.objectContaining({
      message: ERR_ORCA_FAILED_TO_LOAD_GUIDEPUP_SETTINGS,
      cause: stubError,
    }),
  );

describe("loadGuidepupSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(getOrcaInstallationPath).mockReturnValue(mockInstallationPath);
    jest.mocked(readFileSync).mockImplementation((path) => {
      if (path === mockDefaultSettingsPath) {
        return mockDefaultSettings;
      }

      if (path === mockGuidepupSettingsPath) {
        return mockGuidepupSettings;
      }

      throw new Error("unexpected path");
    });
  });

  describe("when the settings load", () => {
    beforeEach(() => {
      loadGuidepupSettings();
    });

    it("should reset the guidepup profile first", () => {
      expect(resetGuidepupSettings).toHaveBeenCalled();
      expect(
        jest.mocked(resetGuidepupSettings).mock.invocationCallOrder[0],
      ).toBeLessThan(jest.mocked(execFileSync).mock.invocationCallOrder[0]);
    });

    it("should load the default settings, then the guidepup settings on top", () => {
      expect(execFileSync).toHaveBeenNthCalledWith(
        1,
        "dconf",
        ["load", ORCA_GUIDEPUP_DCONF_PATH_PREFIX],
        { input: mockDefaultSettings },
      );
      expect(execFileSync).toHaveBeenNthCalledWith(
        2,
        "dconf",
        ["load", ORCA_GUIDEPUP_DCONF_PATH_PREFIX],
        { input: mockGuidepupSettings },
      );
    });
  });

  describe.each`
    file              | path
    ${"default.ini"}  | ${mockDefaultSettingsPath}
    ${"guidepup.ini"} | ${mockGuidepupSettingsPath}
  `("when $file cannot be read", ({ path }) => {
    beforeEach(() => {
      const readFileSyncImplementation = jest
        .mocked(readFileSync)
        .getMockImplementation();

      jest.mocked(readFileSync).mockImplementation((file, options) => {
        if (file === path) {
          throw stubError;
        }

        return readFileSyncImplementation(file, options);
      });
    });

    it("should throw with the cause", () => {
      expectLoadError();
    });

    it("should not change the settings", () => {
      try {
        loadGuidepupSettings();
      } catch {
        // swallow
      }

      expect(resetGuidepupSettings).not.toHaveBeenCalled();
      expect(execFileSync).not.toHaveBeenCalled();
    });
  });

  describe.each`
    file              | call
    ${"default.ini"}  | ${1}
    ${"guidepup.ini"} | ${2}
  `("when $file cannot be loaded", ({ call }) => {
    beforeEach(() => {
      let calls = 0;

      jest.mocked(execFileSync).mockImplementation(() => {
        calls++;

        if (calls === call) {
          throw stubError;
        }

        return Buffer.from("");
      });
    });

    it("should throw with the cause", () => {
      expectLoadError();
    });
  });
});
