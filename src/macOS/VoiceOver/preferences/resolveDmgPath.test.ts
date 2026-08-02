import {
  ERR_MACOS_VERSION_NOT_SUPPORTED,
  ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES,
} from "../../errors";
import { existsSync } from "node:fs";
import { release } from "node:os";
import { resolveDmgPath } from "./resolveDmgPath";

jest.mock("node:fs", () => ({
  existsSync: jest.fn(),
}));

jest.mock("node:os", () => ({
  release: jest.fn(),
}));

jest.mock("../../../../manifest.json", () => ({
  screenReaders: [
    {
      id: "voiceover",
      assets: [
        {
          platformVersion: "123",
          version: "test-version",
          asset: "test-asset.dmg",
        },
      ],
    },
  ],
}));

const cachePathDummy = "test-cache-path";
const assetPathDummy =
  "test-cache-path/voiceover/123/test-version/test-asset.dmg";

describe("resolveDmgPath", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(release).mockReturnValue("123.0.0");
  });

  describe("when a matching VoiceOver asset exists", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(true);

      resolveDmgPath(cachePathDummy);
    });

    it("should get the current macOS major version", () => {
      expect(release).toHaveBeenCalled();
    });

    it("should check that the dmg asset exists", () => {
      expect(existsSync).toHaveBeenCalledWith(assetPathDummy);
    });

    it("should return the dmg asset path", () => {
      expect(resolveDmgPath(cachePathDummy)).toBe(assetPathDummy);
    });
  });

  describe("when no matching macOS version exists", () => {
    beforeEach(() => {
      jest.mocked(release).mockReturnValue("321.0.0");
    });

    it("should throw an error", () => {
      expect(() => resolveDmgPath(cachePathDummy)).toThrow(
        ERR_MACOS_VERSION_NOT_SUPPORTED,
      );
    });
  });

  describe("when the dmg asset does not exist", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(false);
    });

    it("should throw an error", () => {
      expect(() => resolveDmgPath(cachePathDummy)).toThrow(
        ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES,
      );
    });
  });
});
