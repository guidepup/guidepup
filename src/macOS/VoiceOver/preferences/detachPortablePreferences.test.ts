import { detachPortablePreferences } from "./detachPortablePreferences";
import { execFileSync } from "node:child_process";
import { MOUNT_POINT } from "./constants";
import { rmSync } from "node:fs";

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
}));

jest.mock("node:fs", () => ({
  rmSync: jest.fn(),
}));

const dmgPathDummy = "test-dmg-path";
const errorDummy = new Error("test-error");

describe("detachPortablePreferences", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when called with a dmg path", () => {
    beforeEach(() => {
      detachPortablePreferences(dmgPathDummy);
    });

    it("should detach the mounted preferences image", () => {
      expect(execFileSync).toHaveBeenCalledWith(
        "/usr/bin/hdiutil",
        ["detach", MOUNT_POINT],
        { stdio: "ignore" },
      );
    });

    it("should remove the dmg shadow file", () => {
      expect(rmSync).toHaveBeenCalledWith(`${dmgPathDummy}.shadow`, {
        force: true,
      });
    });
  });

  describe("when detaching the preferences image fails", () => {
    beforeEach(() => {
      jest.mocked(execFileSync).mockImplementation(() => {
        throw errorDummy;
      });

      detachPortablePreferences(dmgPathDummy);
    });

    it("should still remove the dmg shadow file", () => {
      expect(rmSync).toHaveBeenCalledWith(`${dmgPathDummy}.shadow`, {
        force: true,
      });
    });
  });

  describe("when removing the dmg shadow file fails", () => {
    beforeEach(() => {
      jest.mocked(rmSync).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should swallow the error", () => {
      expect(() => detachPortablePreferences(dmgPathDummy)).not.toThrow();
    });
  });

  describe("when detaching the preferences image and removing the dmg shadow file both fail", () => {
    beforeEach(() => {
      jest.mocked(execFileSync).mockImplementation(() => {
        throw errorDummy;
      });

      jest.mocked(rmSync).mockImplementation(() => {
        throw errorDummy;
      });

      detachPortablePreferences(dmgPathDummy);
    });

    it("should swallow the errors", () => {
      expect(execFileSync).toHaveBeenCalledWith(
        "/usr/bin/hdiutil",
        ["detach", MOUNT_POINT],
        { stdio: "ignore" },
      );
      expect(rmSync).toHaveBeenCalledWith(`${dmgPathDummy}.shadow`, {
        force: true,
      });
    });
  });
});
