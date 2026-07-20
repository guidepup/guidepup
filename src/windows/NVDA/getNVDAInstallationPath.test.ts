import type { existsSync as _existsSync } from "node:fs";
import type { getNVDAInstallationPath as _getNVDAInstallationPath } from "./getNVDAInstallationPath";
import type { resolveCachePath as _resolveCachePath } from "../../resolveCachePath";

const mockResolvedCachePath = "test-cache-path";
const mockNVDAVersion = "test-nvda-version";
const mockManifest = {
  screenReaders: [
    {
      id: "nvda",
      assets: [
        {
          version: mockNVDAVersion,
        },
      ],
    },
  ],
};

describe("getNVDAInstallationPath", () => {
  let getNVDAInstallationPath: typeof _getNVDAInstallationPath;
  let existsSync: typeof _existsSync;
  let resolveCachePath: typeof _resolveCachePath;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();

    jest.mock("fs", () => ({
      existsSync: jest.fn(),
    }));
    jest.mock("../../../manifest.json", () => mockManifest);
    jest.mock("../../resolveCachePath", () => ({
      resolveCachePath: jest.fn(),
    }));

    ({ existsSync } = await import("fs"));
    ({ resolveCachePath } = await import("../../resolveCachePath"));
    ({ getNVDAInstallationPath } = await import("./getNVDAInstallationPath"));

    jest.mocked(resolveCachePath).mockReturnValue(mockResolvedCachePath);
  });

  describe("when called for the first time", () => {
    let result: string | null;

    describe("when the cached asset doesn't exist", () => {
      beforeEach(() => {
        jest.mocked(existsSync).mockReturnValue(false);

        result = getNVDAInstallationPath();
      });

      it("should resolve the cache path", () => {
        expect(resolveCachePath).toHaveBeenCalled();
      });

      it("should check if the cached asset exists", () => {
        expect(existsSync).toHaveBeenCalledWith(
          `${mockResolvedCachePath}/nvda/all/${mockNVDAVersion}/extracted/nvda.exe`,
        );
      });

      it("should return null", () => {
        expect(result).toBeNull();
      });
    });

    describe("when the cache asset exists", () => {
      beforeEach(() => {
        jest.mocked(existsSync).mockReturnValue(true);

        result = getNVDAInstallationPath();
      });

      it("should resolve the cache path", () => {
        expect(resolveCachePath).toHaveBeenCalled();
      });

      it("should check if the cached asset exists", () => {
        expect(existsSync).toHaveBeenCalledWith(
          `${mockResolvedCachePath}/nvda/all/${mockNVDAVersion}/extracted/nvda.exe`,
        );
      });

      it("should return the installation path", () => {
        expect(result).toBe(
          `${mockResolvedCachePath}/nvda/all/${mockNVDAVersion}/extracted/nvda.exe`,
        );
      });

      describe("when called again", () => {
        beforeEach(() => {
          jest.clearAllMocks();

          result = getNVDAInstallationPath();
        });

        it("should not resolve the cache path again", () => {
          expect(resolveCachePath).not.toHaveBeenCalled();
        });

        it("should resolve to the same path", () => {
          expect(result).toBe(
            `${mockResolvedCachePath}/nvda/all/${mockNVDAVersion}/extracted/nvda.exe`,
          );
        });
      });
    });
  });
});
