import { detachPortablePreferences } from "./detachPortablePreferences";
import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { parse } = require("plist");

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
}));

jest.mock("node:fs", () => ({
  rmSync: jest.fn(),
}));

jest.mock("plist", () => ({
  parse: jest.fn(),
}));

const dmgPathDummy = "test-dmg-path";
const xmlDummy = "test-xml";
const errorDummy = new Error("test-error");

const imageDummy = (
  imagePath: string,
  device: string,
  mountPoint?: string,
) => ({
  "image-path": imagePath,
  "system-entities": [
    { "dev-entry": device },
    { "dev-entry": `${device}s1`, "mount-point": mountPoint },
  ],
});

const execFileSyncStub =
  (failingCommand?: string) => (file: string, args: string[]) => {
    if ([file, ...args].join(" ") === failingCommand) {
      throw errorDummy;
    }

    return args[0] === "info" ? xmlDummy : Buffer.from("");
  };

const expectShadowRemoved = () => {
  expect(rmSync).toHaveBeenCalledWith(`${dmgPathDummy}.shadow`, {
    force: true,
  });
};

describe("detachPortablePreferences", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(execFileSync).mockImplementation(execFileSyncStub());
    jest.mocked(parse).mockReturnValue({
      images: [
        imageDummy("other-dmg-path", "/dev/other", "/Volumes/other"),
        imageDummy(dmgPathDummy, "/dev/mounted", "/Volumes/mounted"),
        imageDummy(dmgPathDummy, "/dev/unmounted"),
      ],
    });
  });

  describe("when called with a dmg path", () => {
    beforeEach(() => {
      detachPortablePreferences(dmgPathDummy);
    });

    it("should unmount the mounted preferences volume", () => {
      expect(execFileSync).toHaveBeenCalledWith(
        "/sbin/umount",
        ["/Volumes/mounted"],
        { stdio: "ignore" },
      );
    });

    it("should leave other images alone", () => {
      expect(execFileSync).not.toHaveBeenCalledWith(
        "/sbin/umount",
        ["/Volumes/other"],
        expect.anything(),
      );
      expect(execFileSync).not.toHaveBeenCalledWith(
        "/usr/bin/hdiutil",
        ["detach", "/dev/other"],
        expect.anything(),
      );
    });

    it.each(["/dev/mounted", "/dev/unmounted"])(
      "should detach the preferences image %s",
      (device) => {
        expect(execFileSync).toHaveBeenCalledWith(
          "/usr/bin/hdiutil",
          ["detach", device],
          { stdio: "ignore" },
        );
      },
    );

    it("should remove the dmg shadow file", () => {
      expectShadowRemoved();
    });
  });

  describe("when listing the attached images fails", () => {
    beforeEach(() => {
      jest.mocked(parse).mockImplementation(() => {
        throw errorDummy;
      });

      detachPortablePreferences(dmgPathDummy);
    });

    it("should not unmount or detach anything", () => {
      expect(execFileSync).toHaveBeenCalledTimes(1);
    });

    it("should still remove the dmg shadow file", () => {
      expectShadowRemoved();
    });
  });

  describe("when unmounting a preferences volume fails", () => {
    beforeEach(() => {
      jest
        .mocked(execFileSync)
        .mockImplementation(execFileSyncStub("/sbin/umount /Volumes/mounted"));

      detachPortablePreferences(dmgPathDummy);
    });

    it("should not detach that image", () => {
      expect(execFileSync).not.toHaveBeenCalledWith(
        "/usr/bin/hdiutil",
        ["detach", "/dev/mounted"],
        expect.anything(),
      );
    });

    it("should still detach the other preferences images", () => {
      expect(execFileSync).toHaveBeenCalledWith(
        "/usr/bin/hdiutil",
        ["detach", "/dev/unmounted"],
        { stdio: "ignore" },
      );
    });

    it("should still remove the dmg shadow file", () => {
      expectShadowRemoved();
    });
  });

  describe("when detaching a preferences image fails", () => {
    beforeEach(() => {
      jest
        .mocked(execFileSync)
        .mockImplementation(
          execFileSyncStub("/usr/bin/hdiutil detach /dev/mounted"),
        );

      detachPortablePreferences(dmgPathDummy);
    });

    it("should still detach the other preferences images", () => {
      expect(execFileSync).toHaveBeenCalledWith(
        "/usr/bin/hdiutil",
        ["detach", "/dev/unmounted"],
        { stdio: "ignore" },
      );
    });

    it("should still remove the dmg shadow file", () => {
      expectShadowRemoved();
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
});
