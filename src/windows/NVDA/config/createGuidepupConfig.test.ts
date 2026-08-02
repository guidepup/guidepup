import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import {
  ERR_NVDA_FAILED_TO_CREATE_GUIDEPUP_PREFERENCES,
  ERR_NVDA_NOT_INSTALLED,
} from "../../errors";
import { createGuidepupConfig } from "./createGuidepupConfig";
import { resolveGuidepupUserConfigPath } from "./resolveGuidepupUserConfigPath";
import { resolveSessionUserConfigPath } from "./resolveSessionUserConfigPath";

jest.mock("node:fs", () => ({
  cpSync: jest.fn(),
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  readdirSync: jest.fn(),
  rmSync: jest.fn(),
}));

jest.mock("./resolveGuidepupUserConfigPath", () => ({
  resolveGuidepupUserConfigPath: jest.fn(),
}));

jest.mock("./resolveSessionUserConfigPath", () => ({
  resolveSessionUserConfigPath: jest.fn(),
}));

const guidepupUserConfigPathDummy = "test-guidepup-user-config";
const sessionUserConfigPathDummy = "test-session-user-config";
const entriesDummy = ["config", "state.ini"] as unknown as ReturnType<
  typeof readdirSync
>;

const errorDummy = new Error("test-error");

describe("createGuidepupConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest
      .mocked(resolveGuidepupUserConfigPath)
      .mockReturnValue(guidepupUserConfigPathDummy);

    jest
      .mocked(resolveSessionUserConfigPath)
      .mockReturnValue(sessionUserConfigPathDummy);

    jest.mocked(existsSync).mockReturnValue(true);
    jest.mocked(readdirSync).mockReturnValue(entriesDummy);
  });

  describe("when Guidepup user config does not exist", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(false);
    });

    it("should throw an error", () => {
      expect(() => createGuidepupConfig()).toThrow(ERR_NVDA_NOT_INSTALLED);
    });
  });

  describe("when Guidepup user config exists", () => {
    beforeEach(() => {
      createGuidepupConfig();
    });

    it("should remove the existing session user config", () => {
      expect(rmSync).toHaveBeenCalledWith(sessionUserConfigPathDummy, {
        recursive: true,
        force: true,
      });
    });

    it("should create the session user config directory", () => {
      expect(mkdirSync).toHaveBeenCalledWith(sessionUserConfigPathDummy, {
        recursive: true,
      });
    });

    it("should read the Guidepup user config entries", () => {
      expect(readdirSync).toHaveBeenCalledWith(guidepupUserConfigPathDummy, {
        encoding: "utf-8",
      });
    });

    it("should copy each Guidepup user config entry to the session user config", () => {
      expect(cpSync).toHaveBeenNthCalledWith(
        1,
        "test-guidepup-user-config/config",
        "test-session-user-config/config",
        {
          recursive: true,
        },
      );

      expect(cpSync).toHaveBeenNthCalledWith(
        2,
        "test-guidepup-user-config/state.ini",
        "test-session-user-config/state.ini",
        {
          recursive: true,
        },
      );
    });
  });

  describe("when removing the existing session user config fails", () => {
    beforeEach(() => {
      jest.mocked(rmSync).mockImplementation(() => {
        throw errorDummy;
      });

      createGuidepupConfig();
    });

    it("should continue creating the session user config", () => {
      expect(mkdirSync).toHaveBeenCalledWith(sessionUserConfigPathDummy, {
        recursive: true,
      });
    });
  });

  describe("when creating the session user config fails", () => {
    beforeEach(() => {
      jest.mocked(mkdirSync).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() => createGuidepupConfig()).toThrow(
        new Error(ERR_NVDA_FAILED_TO_CREATE_GUIDEPUP_PREFERENCES, {
          cause: errorDummy,
        }),
      );
    });

    it("should remove the session user config", () => {
      try {
        createGuidepupConfig();
      } catch {
        // Swallow
      }

      expect(rmSync).toHaveBeenLastCalledWith(sessionUserConfigPathDummy, {
        recursive: true,
        force: true,
      });
    });
  });

  describe("when reading the Guidepup user config fails", () => {
    beforeEach(() => {
      jest.mocked(readdirSync).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() => createGuidepupConfig()).toThrow(
        new Error(ERR_NVDA_FAILED_TO_CREATE_GUIDEPUP_PREFERENCES, {
          cause: errorDummy,
        }),
      );
    });
  });

  describe("when copying the Guidepup user config fails", () => {
    beforeEach(() => {
      jest.mocked(cpSync).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() => createGuidepupConfig()).toThrow(
        new Error(ERR_NVDA_FAILED_TO_CREATE_GUIDEPUP_PREFERENCES, {
          cause: errorDummy,
        }),
      );
    });

    it("should remove the session user config", () => {
      try {
        createGuidepupConfig();
      } catch {
        // Swallow
      }

      expect(rmSync).toHaveBeenLastCalledWith(sessionUserConfigPathDummy, {
        recursive: true,
        force: true,
      });
    });
  });
});
