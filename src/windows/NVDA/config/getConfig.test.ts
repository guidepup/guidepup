import { existsSync, readFileSync } from "node:fs";
import { ERR_NVDA_FAILED_TO_GET_SETTINGS } from "../../errors";
import { getConfig } from "./getConfig";
import { parseIni } from "./parseIni";
import { resolveGuidepupUserConfigPath } from "./resolveGuidepupUserConfigPath";
import { resolveSessionUserConfigPath } from "./resolveSessionUserConfigPath";

jest.mock("node:fs", () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));

jest.mock("./parseIni", () => ({
  parseIni: jest.fn(),
}));

jest.mock("./resolveGuidepupUserConfigPath", () => ({
  resolveGuidepupUserConfigPath: jest.fn(),
}));

jest.mock("./resolveSessionUserConfigPath", () => ({
  resolveSessionUserConfigPath: jest.fn(),
}));

const sessionUserConfigPathDummy = "test-session-user-config";
const guidepupUserConfigPathDummy = "test-guidepup-user-config";

const sessionConfigPathDummy = "test-session-user-config/nvda.ini";
const guidepupConfigPathDummy = "test-guidepup-user-config/nvda.ini";

const contentsDummy = "test-config";
const configDummy = {
  testSetting: "test-value",
};

const errorDummy = new Error("test-error");

describe("getConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest
      .mocked(resolveSessionUserConfigPath)
      .mockReturnValue(sessionUserConfigPathDummy);

    jest
      .mocked(resolveGuidepupUserConfigPath)
      .mockReturnValue(guidepupUserConfigPathDummy);

    jest.mocked(readFileSync).mockReturnValue(contentsDummy);
    jest.mocked(parseIni).mockReturnValue(configDummy);
  });

  describe("when the session user config exists", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(true);
    });

    it("should check whether the session user config exists", () => {
      getConfig();

      expect(existsSync).toHaveBeenCalledWith(sessionConfigPathDummy);
    });

    it("should read the session user config", () => {
      getConfig();

      expect(readFileSync).toHaveBeenCalledWith(sessionConfigPathDummy, "utf8");
    });

    it("should parse the config", () => {
      getConfig();

      expect(parseIni).toHaveBeenCalledWith(contentsDummy);
    });
  });

  describe("when the session user config does not exist", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(false);
    });

    it("should read the Guidepup user config", () => {
      getConfig();

      expect(readFileSync).toHaveBeenCalledWith(
        guidepupConfigPathDummy,
        "utf8",
      );
    });

    it("should parse the config", () => {
      getConfig();

      expect(parseIni).toHaveBeenCalledWith(contentsDummy);
    });
  });

  describe("when reading the config fails", () => {
    beforeEach(() => {
      jest.mocked(readFileSync).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() => getConfig()).toThrow(
        new Error(ERR_NVDA_FAILED_TO_GET_SETTINGS, {
          cause: errorDummy,
        }),
      );
    });
  });

  describe("when parsing the config fails", () => {
    beforeEach(() => {
      jest.mocked(parseIni).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() => getConfig()).toThrow(
        new Error(ERR_NVDA_FAILED_TO_GET_SETTINGS, {
          cause: errorDummy,
        }),
      );
    });
  });
});
