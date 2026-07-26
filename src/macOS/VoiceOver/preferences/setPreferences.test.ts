import { DEFAULT_PREFERENCES } from "./constants";
import { ERR_VOICE_OVER_FAILED_TO_SET_SETTING } from "../../errors";
import { getPreferences } from "./getPreferences";
import { restartPreferencesDaemon } from "./restartPreferencesDaemon";
import { setPreferences } from "./setPreferences";
import { writeFileSync } from "node:fs";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { build } = require("plist");

jest.mock("./getPreferences", () => ({
  getPreferences: jest.fn(),
}));

jest.mock("./restartPreferencesDaemon", () => ({
  restartPreferencesDaemon: jest.fn(),
}));

jest.mock("node:fs", () => ({
  writeFileSync: jest.fn(),
}));

jest.mock("plist", () => ({
  build: jest.fn(),
}));

const preferencesDummy = {
  existingPreference: "existing-value",
};
const desiredPreferencesDummy = {
  desiredPreference: "desired-value",
};
const updatedPreferencesDummy = {
  existingPreference: "existing-value",
  desiredPreference: "desired-value",
};
const plistDummy = "test-plist";
const errorDummy = new Error("test-error");

describe("setPreferences", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(getPreferences).mockReturnValue(preferencesDummy);
    jest.mocked(build).mockReturnValue(plistDummy);
  });

  describe("when called with desired preferences", () => {
    beforeEach(() => {
      setPreferences(desiredPreferencesDummy);
    });

    it("should get the current preferences", () => {
      expect(getPreferences).toHaveBeenCalled();
    });

    it("should build the updated preferences plist", () => {
      expect(build).toHaveBeenCalledWith(updatedPreferencesDummy);
    });

    it("should write the updated preferences", () => {
      expect(writeFileSync).toHaveBeenCalledWith(
        DEFAULT_PREFERENCES,
        plistDummy,
      );
    });

    it("should restart the preferences daemon", () => {
      expect(restartPreferencesDaemon).toHaveBeenCalled();
    });
  });

  describe("when getting preferences fails", () => {
    beforeEach(() => {
      jest.mocked(getPreferences).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() => setPreferences(desiredPreferencesDummy)).toThrow(
        new Error(ERR_VOICE_OVER_FAILED_TO_SET_SETTING, {
          cause: errorDummy,
        }),
      );
    });

    it("should not write the updated preferences", () => {
      try {
        setPreferences(desiredPreferencesDummy);
      } catch {
        // Swallow
      }

      expect(writeFileSync).not.toHaveBeenCalled();
    });

    it("should not restart the preferences daemon", () => {
      try {
        setPreferences(desiredPreferencesDummy);
      } catch {
        // Swallow
      }

      expect(restartPreferencesDaemon).not.toHaveBeenCalled();
    });
  });

  describe("when building the preferences plist fails", () => {
    beforeEach(() => {
      jest.mocked(build).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() => setPreferences(desiredPreferencesDummy)).toThrow(
        new Error(ERR_VOICE_OVER_FAILED_TO_SET_SETTING, {
          cause: errorDummy,
        }),
      );
    });

    it("should not write the updated preferences", () => {
      try {
        setPreferences(desiredPreferencesDummy);
      } catch {
        // Swallow
      }

      expect(writeFileSync).not.toHaveBeenCalled();
    });

    it("should not restart the preferences daemon", () => {
      try {
        setPreferences(desiredPreferencesDummy);
      } catch {
        // Swallow
      }

      expect(restartPreferencesDaemon).not.toHaveBeenCalled();
    });
  });

  describe("when writing preferences fails", () => {
    beforeEach(() => {
      jest.mocked(writeFileSync).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() => setPreferences(desiredPreferencesDummy)).toThrow(
        new Error(ERR_VOICE_OVER_FAILED_TO_SET_SETTING, {
          cause: errorDummy,
        }),
      );
    });

    it("should not restart the preferences daemon", () => {
      try {
        setPreferences(desiredPreferencesDummy);
      } catch {
        // Swallow
      }

      expect(restartPreferencesDaemon).not.toHaveBeenCalled();
    });
  });
});
