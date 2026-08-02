import { rmSync, symlinkSync } from "node:fs";
import { createPortableSymlinks } from "./createPortableSymlinks";
import { ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES } from "../../errors";
import { join } from "node:path";
import { PREFERENCES_PATH } from "./constants";

jest.mock("node:fs", () => ({
  rmSync: jest.fn(),
  symlinkSync: jest.fn(),
}));

jest.mock("node:path", () => ({
  join: jest.fn(),
}));

describe("createPortableSymlinks", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest
      .mocked(join)
      .mockImplementation((directory, file) => `${directory}/${file}`);
  });

  describe("when called with a preferences directory", () => {
    beforeEach(() => {
      createPortableSymlinks("test-preferences-directory");
    });

    it("should remove existing portable preference files", () => {
      expect(rmSync).toHaveBeenCalledWith(
        "test-preferences-directory/com.apple.VoiceOver4.portable.scrd",
        { force: true },
      );
      expect(rmSync).toHaveBeenCalledWith(
        "test-preferences-directory/com.apple.VoiceOver4.portable.scrd.vou",
        { force: true },
      );
      expect(rmSync).toHaveBeenCalledWith(
        "test-preferences-directory/com.apple.VoiceOver4.portable.scro",
        { force: true },
      );
      expect(rmSync).toHaveBeenCalledWith(
        "test-preferences-directory/com.apple.VoiceOver4.portable.scui",
        { force: true },
      );
      expect(rmSync).toHaveBeenCalledTimes(4);
    });

    it("should create symlinks for each portable preference file", () => {
      expect(symlinkSync).toHaveBeenCalledWith(
        PREFERENCES_PATH,
        "test-preferences-directory/com.apple.VoiceOver4.portable.scrd",
      );
      expect(symlinkSync).toHaveBeenCalledWith(
        PREFERENCES_PATH,
        "test-preferences-directory/com.apple.VoiceOver4.portable.scrd.vou",
      );
      expect(symlinkSync).toHaveBeenCalledWith(
        PREFERENCES_PATH,
        "test-preferences-directory/com.apple.VoiceOver4.portable.scro",
      );
      expect(symlinkSync).toHaveBeenCalledWith(
        PREFERENCES_PATH,
        "test-preferences-directory/com.apple.VoiceOver4.portable.scui",
      );
      expect(symlinkSync).toHaveBeenCalledTimes(4);
    });
  });

  describe("when removing an existing portable preference file fails", () => {
    beforeEach(() => {
      jest.mocked(rmSync).mockImplementation(() => {
        throw new Error("test-error");
      });

      createPortableSymlinks("test-preferences-directory");
    });

    it("should continue creating portable symlinks", () => {
      expect(symlinkSync).toHaveBeenCalledTimes(4);
    });
  });

  describe("when creating a portable symlink fails", () => {
    const cause = new Error("test-error");

    beforeEach(() => {
      jest.mocked(symlinkSync).mockImplementation(() => {
        throw cause;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() =>
        createPortableSymlinks("test-preferences-directory"),
      ).toThrow(
        new Error(ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES, {
          cause,
        }),
      );
    });
  });
});
