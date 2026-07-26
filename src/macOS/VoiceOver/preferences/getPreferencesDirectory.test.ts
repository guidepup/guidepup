import { existsSync } from "node:fs";
import { getPreferencesDirectory } from "./getPreferencesDirectory";
import { homedir } from "node:os";

jest.mock("node:fs", () => ({
  existsSync: jest.fn(),
}));

jest.mock("node:os", () => ({
  homedir: jest.fn(),
}));

const homeDirectoryDummy = "test-home-directory";

describe("getPreferencesDirectory", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(homedir).mockReturnValue(homeDirectoryDummy);
  });

  describe("when the VoiceOver group containers preferences directory exists", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(true);
    });

    it("should check whether the VoiceOver preferences directory exists", () => {
      getPreferencesDirectory();

      expect(existsSync).toHaveBeenCalledWith(
        `${homeDirectoryDummy}/Library/Group Containers/group.com.apple.VoiceOver/Library/Preferences`,
      );
    });

    it("should return the VoiceOver group containers preferences directory", () => {
      expect(getPreferencesDirectory()).toBe(
        `${homeDirectoryDummy}/Library/Group Containers/group.com.apple.VoiceOver/Library/Preferences`,
      );
    });
  });

  describe("when the VoiceOver preferences directory does not exist", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(false);
    });

    it("should check whether the VoiceOver preferences directory exists", () => {
      getPreferencesDirectory();

      expect(existsSync).toHaveBeenCalledWith(
        `${homeDirectoryDummy}/Library/Group Containers/group.com.apple.VoiceOver/Library/Preferences`,
      );
    });

    it("should return the legacy preferences directory", () => {
      expect(getPreferencesDirectory()).toBe(
        `${homeDirectoryDummy}/Library/Preferences`,
      );
    });
  });
});
