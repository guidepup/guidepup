import { ensureLocalPreferencesExist } from "./ensureLocalPreferencesExist";
import { ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES } from "../../errors";
import { existsSync } from "node:fs";
import { join } from "node:path";

jest.mock("node:fs", () => ({
  existsSync: jest.fn(),
}));

jest.mock("node:path", () => ({
  join: jest.fn(),
}));

const preferencesDirectoryDummy = "test-preferences-directory";
const localPreferencesPathDummy = "test-local-preferences-path";

describe("ensureLocalPreferencesExist", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(join).mockReturnValue(localPreferencesPathDummy);
  });

  describe("when the local preferences file exists", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(true);

      ensureLocalPreferencesExist(preferencesDirectoryDummy);
    });

    it("should check whether the local preferences file exists", () => {
      expect(join).toHaveBeenCalledWith(
        preferencesDirectoryDummy,
        "com.apple.VoiceOver4.local.plist",
      );
      expect(existsSync).toHaveBeenCalledWith(localPreferencesPathDummy);
    });
  });

  describe("when the local preferences file does not exist", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(false);
    });

    it("should throw an error", () => {
      expect(() =>
        ensureLocalPreferencesExist(preferencesDirectoryDummy),
      ).toThrow(ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES);
    });
  });
});
