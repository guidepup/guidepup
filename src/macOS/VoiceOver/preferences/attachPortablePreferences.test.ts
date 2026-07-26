import { attachPortablePreferences } from "./attachPortablePreferences";
import { ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES } from "../../errors";
import { execFileSync } from "node:child_process";
import { MOUNT_POINT } from "./constants";

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
}));

describe("attachPortablePreferences", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when attaching the preferences image succeeds", () => {
    beforeEach(() => {
      attachPortablePreferences("test-dmg-path");
    });

    it("should attach the preferences image", () => {
      expect(execFileSync).toHaveBeenCalledWith(
        "/usr/bin/hdiutil",
        [
          "attach",
          "test-dmg-path",
          "-mountpoint",
          MOUNT_POINT,
          "-shadow",
          "test-dmg-path.shadow",
        ],
        { stdio: "ignore" },
      );
    });
  });

  describe("when attaching the preferences image throws an error", () => {
    const cause = new Error("test-error");

    beforeEach(() => {
      jest.mocked(execFileSync).mockImplementation(() => {
        throw cause;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() => attachPortablePreferences("test-dmg-path")).toThrow(
        new Error(ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES, {
          cause,
        }),
      );
    });
  });
});
