import {
  ERR_LINUX_VERSION_NOT_SUPPORTED,
  ERR_ORCA_FAILED_TO_LOAD_GUIDEPUP_SETTINGS,
} from "../errors";
import type { existsSync as _existsSync } from "node:fs";
import type { getOrcaInstallationPath as _getOrcaInstallationPath } from "./getOrcaInstallationPath";
import type { release as _release } from "node:os";
import type { resolveCachePath as _resolveCachePath } from "../../resolveCachePath";
import { join } from "node:path";

const mockResolvedCachePath = "test-cache-path";
const mockOrcaVersion = "test-orca-version";
const mockInstallationPath = join(
  mockResolvedCachePath,
  "orca",
  "7",
  mockOrcaVersion,
  "extracted",
);
const mockManifest = {
  screenReaders: [
    {
      id: "nvda",
      assets: [{ version: "test-nvda-version" }],
    },
    {
      id: "orca",
      assets: [
        { version: "test-other-orca-version", platformVersion: "6" },
        { version: mockOrcaVersion, platformVersion: "7" },
      ],
    },
  ],
};

describe("getOrcaInstallationPath", () => {
  let getOrcaInstallationPath: typeof _getOrcaInstallationPath;
  let existsSync: typeof _existsSync;
  let release: typeof _release;
  let resolveCachePath: typeof _resolveCachePath;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();

    jest.mock("node:fs", () => ({
      existsSync: jest.fn(),
    }));
    jest.mock("node:os", () => ({
      release: jest.fn(),
    }));
    jest.mock("../../../manifest.json", () => mockManifest);
    jest.mock("../../resolveCachePath", () => ({
      resolveCachePath: jest.fn(),
    }));

    ({ existsSync } = await import("node:fs"));
    ({ release } = await import("node:os"));
    ({ resolveCachePath } = await import("../../resolveCachePath"));
    ({ getOrcaInstallationPath } = await import("./getOrcaInstallationPath"));

    jest.mocked(release).mockReturnValue("7.0.0-28-generic");
    jest.mocked(resolveCachePath).mockReturnValue(mockResolvedCachePath);
  });

  describe("when there is no asset for the kernel version", () => {
    beforeEach(() => {
      jest.mocked(release).mockReturnValue("5.15.0-1-generic");
    });

    it("should throw", () => {
      expect(() => getOrcaInstallationPath()).toThrow(
        ERR_LINUX_VERSION_NOT_SUPPORTED,
      );
    });

    it("should not resolve the cache path", () => {
      try {
        getOrcaInstallationPath();
      } catch {
        // swallow
      }

      expect(resolveCachePath).not.toHaveBeenCalled();
    });
  });

  describe("when the cached asset doesn't exist", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(false);
    });

    it("should throw", () => {
      expect(() => getOrcaInstallationPath()).toThrow(
        ERR_ORCA_FAILED_TO_LOAD_GUIDEPUP_SETTINGS,
      );
    });

    it("should check the asset for the kernel version", () => {
      try {
        getOrcaInstallationPath();
      } catch {
        // swallow
      }

      expect(existsSync).toHaveBeenCalledWith(mockInstallationPath);
    });
  });

  describe("when the cached asset exists", () => {
    let result: string;

    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(true);

      result = getOrcaInstallationPath();
    });

    it("should return the installation path", () => {
      expect(result).toBe(mockInstallationPath);
    });

    describe("when called again", () => {
      beforeEach(() => {
        jest.clearAllMocks();

        result = getOrcaInstallationPath();
      });

      it("should not resolve the cache path again", () => {
        expect(resolveCachePath).not.toHaveBeenCalled();
      });

      it("should not check the asset exists again", () => {
        expect(existsSync).not.toHaveBeenCalled();
      });

      it("should return the same path", () => {
        expect(result).toBe(mockInstallationPath);
      });
    });
  });
});
