import { lstatSync, readlinkSync, rmSync, symlinkSync } from "node:fs";
import { createPortableSymlinks } from "./createPortableSymlinks";
import { ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES } from "../../errors";
import { join } from "node:path";
import { PREFERENCES_PATH } from "./constants";

jest.mock("node:fs", () => ({
  lstatSync: jest.fn(),
  readlinkSync: jest.fn(),
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

    jest.mocked(lstatSync).mockImplementation(() => {
      throw new Error("ENOENT");
    });
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

  describe("when the portable preference file is already the desired symlink", () => {
    beforeEach(() => {
      jest.mocked(lstatSync).mockReturnValue({
        isSymbolicLink: () => true,
      } as ReturnType<typeof lstatSync>);

      jest.mocked(readlinkSync).mockReturnValue(PREFERENCES_PATH);

      createPortableSymlinks("test-preferences-directory");
    });

    it("should not remove the existing symlinks", () => {
      expect(rmSync).not.toHaveBeenCalled();
    });

    it("should not create new symlinks", () => {
      expect(symlinkSync).not.toHaveBeenCalled();
    });

    it("should check the existing symlink target", () => {
      expect(readlinkSync).toHaveBeenCalledTimes(4);
      expect(readlinkSync).toHaveBeenCalledWith(
        "test-preferences-directory/com.apple.VoiceOver4.portable.scrd",
      );
      expect(readlinkSync).toHaveBeenCalledWith(
        "test-preferences-directory/com.apple.VoiceOver4.portable.scrd.vou",
      );
      expect(readlinkSync).toHaveBeenCalledWith(
        "test-preferences-directory/com.apple.VoiceOver4.portable.scro",
      );
      expect(readlinkSync).toHaveBeenCalledWith(
        "test-preferences-directory/com.apple.VoiceOver4.portable.scui",
      );
    });
  });

  describe("when the portable preference file is an incorrect symlink", () => {
    beforeEach(() => {
      jest.mocked(lstatSync).mockReturnValue({
        isSymbolicLink: () => true,
      } as ReturnType<typeof lstatSync>);

      jest.mocked(readlinkSync).mockReturnValue("/incorrect/preferences/path");

      createPortableSymlinks("test-preferences-directory");
    });

    it("should remove the existing symlink", () => {
      expect(rmSync).toHaveBeenCalledTimes(4);
    });

    it("should create the correct symlink", () => {
      expect(symlinkSync).toHaveBeenCalledTimes(4);
      expect(symlinkSync).toHaveBeenCalledWith(
        PREFERENCES_PATH,
        "test-preferences-directory/com.apple.VoiceOver4.portable.scrd",
      );
    });
  });

  describe("when the portable preference file is not a symlink", () => {
    beforeEach(() => {
      jest.mocked(lstatSync).mockReturnValue({
        isSymbolicLink: () => false,
      } as ReturnType<typeof lstatSync>);

      createPortableSymlinks("test-preferences-directory");
    });

    it("should remove the existing file", () => {
      expect(rmSync).toHaveBeenCalledTimes(4);
    });

    it("should create the symlink", () => {
      expect(symlinkSync).toHaveBeenCalledTimes(4);
    });

    it("should not check the target", () => {
      expect(readlinkSync).not.toHaveBeenCalled();
    });
  });

  describe("when checking for an existing portable preference file fails", () => {
    beforeEach(() => {
      jest.mocked(lstatSync).mockImplementation(() => {
        throw new Error("test-error");
      });

      createPortableSymlinks("test-preferences-directory");
    });

    it("should continue creating portable symlinks", () => {
      expect(symlinkSync).toHaveBeenCalledTimes(4);
    });
  });

  describe("when removing an existing portable preference file fails", () => {
    const cause = new Error("test-error");

    beforeEach(() => {
      jest.mocked(rmSync).mockImplementation(() => {
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
