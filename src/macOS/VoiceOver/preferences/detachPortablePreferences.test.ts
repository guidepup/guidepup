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
const deviceDummy = "test-device";
const errorDummy = new Error("test-error");

const execFileSyncStub = (failingFile?: string) => (file: string) => {
  if (file === failingFile) {
    throw errorDummy;
  }

  return file === "/usr/bin/stat" ? `${deviceDummy}\n` : Buffer.from("");
};

describe("detachPortablePreferences", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(execFileSync).mockImplementation(execFileSyncStub());
  });

  describe("when called with a dmg path", () => {
    beforeEach(() => {
      detachPortablePreferences(dmgPathDummy);
    });

    it("should unmount the preferences volume", () => {
      expect(execFileSync).toHaveBeenCalledWith("/sbin/umount", [MOUNT_POINT], {
        stdio: "ignore",
      });
    });

    it("should detach the preferences image by the volume's device", () => {
      expect(execFileSync).toHaveBeenCalledWith(
        "/usr/bin/hdiutil",
        ["detach", deviceDummy],
        { stdio: "ignore" },
      );
    });

    it("should remove the dmg shadow file", () => {
      expect(rmSync).toHaveBeenCalledWith(`${dmgPathDummy}.shadow`, {
        force: true,
      });
    });
  });

  describe("when unmounting the preferences volume fails", () => {
    beforeEach(() => {
      jest
        .mocked(execFileSync)
        .mockImplementation(execFileSyncStub("/sbin/umount"));

      detachPortablePreferences(dmgPathDummy);
    });

    it("should not detach the device", () => {
      expect(execFileSync).not.toHaveBeenCalledWith(
        "/usr/bin/hdiutil",
        expect.anything(),
        expect.anything(),
      );
    });

    it("should still remove the dmg shadow file", () => {
      expect(rmSync).toHaveBeenCalledWith(`${dmgPathDummy}.shadow`, {
        force: true,
      });
    });
  });

  describe("when detaching the preferences image fails", () => {
    beforeEach(() => {
      jest
        .mocked(execFileSync)
        .mockImplementation(execFileSyncStub("/usr/bin/hdiutil"));

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
      jest
        .mocked(execFileSync)
        .mockImplementation(execFileSyncStub("/usr/bin/hdiutil"));

      jest.mocked(rmSync).mockImplementation(() => {
        throw errorDummy;
      });

      detachPortablePreferences(dmgPathDummy);
    });

    it("should swallow the errors", () => {
      expect(rmSync).toHaveBeenCalledWith(`${dmgPathDummy}.shadow`, {
        force: true,
      });
    });
  });
});
