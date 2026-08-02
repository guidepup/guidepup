import { attachPortablePreferences } from "./attachPortablePreferences";
import { DEFAULT_PREFERENCES } from "./constants";
import { detachPortablePreferences } from "./detachPortablePreferences";
import { ERR_VOICE_OVER_FAILED_TO_GET_SETTINGS } from "../../errors";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { getPreferences } from "./getPreferences";
import { resolveCachePath } from "../../../resolveCachePath";
import { resolveDmgPath } from "./resolveDmgPath";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { parse } = require("plist");

jest.mock("./attachPortablePreferences", () => ({
  attachPortablePreferences: jest.fn(),
}));

jest.mock("./detachPortablePreferences", () => ({
  detachPortablePreferences: jest.fn(),
}));

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
}));

jest.mock("node:fs", () => ({
  existsSync: jest.fn(),
}));

jest.mock("../../../resolveCachePath", () => ({
  resolveCachePath: jest.fn(),
}));

jest.mock("./resolveDmgPath", () => ({
  resolveDmgPath: jest.fn(),
}));

jest.mock("plist", () => ({
  parse: jest.fn(),
}));

const cachePathDummy = "test-cache-path";
const dmgPathDummy = "test-dmg-path";
const xmlDummy = "test-xml";
const preferencesDummy = {
  testPreference: "test-value",
};
const errorDummy = new Error("test-error");

describe("getPreferences", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(attachPortablePreferences).mockReturnValue(undefined);
    jest.mocked(detachPortablePreferences).mockReturnValue(undefined);
    jest.mocked(resolveCachePath).mockReturnValue(cachePathDummy);
    jest.mocked(resolveDmgPath).mockReturnValue(dmgPathDummy);
    jest.mocked(execFileSync).mockReturnValue(xmlDummy);
    jest.mocked(parse).mockReturnValue(preferencesDummy);
  });

  describe("when portable preferences already exist", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(true);

      getPreferences();
    });

    it("should check whether portable preferences exist", () => {
      expect(existsSync).toHaveBeenCalledWith(DEFAULT_PREFERENCES);
    });

    it("should read the preferences plist", () => {
      expect(execFileSync).toHaveBeenCalledWith(
        "plutil",
        ["-convert", "xml1", "-o", "-", DEFAULT_PREFERENCES],
        {
          encoding: "utf8",
        },
      );
    });

    it("should parse the preferences plist", () => {
      expect(parse).toHaveBeenCalledWith(xmlDummy);
    });

    it("should not attach portable preferences", () => {
      expect(attachPortablePreferences).not.toHaveBeenCalled();
    });

    it("should not detach portable preferences", () => {
      expect(detachPortablePreferences).not.toHaveBeenCalled();
    });

    it("should return the parsed preferences", () => {
      expect(getPreferences()).toEqual(preferencesDummy);
    });
  });

  describe("when portable preferences do not exist", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(false);

      getPreferences();
    });

    it("should resolve the cache path", () => {
      expect(resolveCachePath).toHaveBeenCalled();
    });

    it("should resolve the dmg path", () => {
      expect(resolveDmgPath).toHaveBeenCalledWith(cachePathDummy);
    });

    it("should attach portable preferences", () => {
      expect(attachPortablePreferences).toHaveBeenCalledWith(dmgPathDummy);
    });

    it("should detach portable preferences", () => {
      expect(detachPortablePreferences).toHaveBeenCalledWith(dmgPathDummy);
    });
  });

  describe("when reading the preferences plist fails", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(true);

      jest.mocked(execFileSync).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() => getPreferences()).toThrow(
        new Error(ERR_VOICE_OVER_FAILED_TO_GET_SETTINGS, {
          cause: errorDummy,
        }),
      );
    });
  });

  describe("when parsing the preferences plist fails", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(true);

      jest.mocked(parse).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() => getPreferences()).toThrow(
        new Error(ERR_VOICE_OVER_FAILED_TO_GET_SETTINGS, {
          cause: errorDummy,
        }),
      );
    });
  });

  describe("when attaching portable preferences fails", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(false);

      jest.mocked(attachPortablePreferences).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() => getPreferences()).toThrow(
        new Error(ERR_VOICE_OVER_FAILED_TO_GET_SETTINGS, {
          cause: errorDummy,
        }),
      );
    });

    it("should detach portable preferences", () => {
      try {
        getPreferences();
      } catch {
        // Swallow
      }

      expect(detachPortablePreferences).toHaveBeenCalledWith(dmgPathDummy);
    });
  });

  describe("when detaching portable preferences fails", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(false);

      jest.mocked(detachPortablePreferences).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should not throw an error", () => {
      expect(() => getPreferences()).not.toThrow();
    });
  });
});
