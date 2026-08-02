import { attachPortablePreferences } from "./attachPortablePreferences";
import { createPortableSymlinks } from "./createPortableSymlinks";
import { detachPortablePreferences } from "./detachPortablePreferences";
import { ensureLocalPreferencesExist } from "./ensureLocalPreferencesExist";
import { getPreferencesDirectory } from "./getPreferencesDirectory";
import { mountGuidepupPreferences } from "./mountGuidepupPreferences";
import { resolveCachePath } from "../../../resolveCachePath";
import { resolveDmgPath } from "./resolveDmgPath";
import { restartPreferencesDaemon } from "./restartPreferencesDaemon";
import { trustPortableIdentifier } from "./trustPortableIdentifier";

jest.mock("./attachPortablePreferences", () => ({
  attachPortablePreferences: jest.fn(),
}));

jest.mock("./createPortableSymlinks", () => ({
  createPortableSymlinks: jest.fn(),
}));

jest.mock("./detachPortablePreferences", () => ({
  detachPortablePreferences: jest.fn(),
}));

jest.mock("./ensureLocalPreferencesExist", () => ({
  ensureLocalPreferencesExist: jest.fn(),
}));

jest.mock("./getPreferencesDirectory", () => ({
  getPreferencesDirectory: jest.fn(),
}));

jest.mock("../../../resolveCachePath", () => ({
  resolveCachePath: jest.fn(),
}));

jest.mock("./resolveDmgPath", () => ({
  resolveDmgPath: jest.fn(),
}));

jest.mock("./restartPreferencesDaemon", () => ({
  restartPreferencesDaemon: jest.fn(),
}));

jest.mock("./trustPortableIdentifier", () => ({
  trustPortableIdentifier: jest.fn(),
}));

const cachePathDummy = "test-cache-path";
const preferencesDirectoryDummy = "test-preferences-directory";
const dmgPathDummy = "test-dmg-path";

describe("mountGuidepupPreferences", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(resolveCachePath).mockReturnValue(cachePathDummy);
    jest
      .mocked(getPreferencesDirectory)
      .mockReturnValue(preferencesDirectoryDummy);
    jest.mocked(resolveDmgPath).mockReturnValue(dmgPathDummy);
  });

  describe("when called", () => {
    beforeEach(() => {
      mountGuidepupPreferences();
    });

    it("should resolve the cache path", () => {
      expect(resolveCachePath).toHaveBeenCalled();
    });

    it("should get the preferences directory", () => {
      expect(getPreferencesDirectory).toHaveBeenCalled();
    });

    it("should ensure local preferences exist", () => {
      expect(ensureLocalPreferencesExist).toHaveBeenCalledWith(
        preferencesDirectoryDummy,
      );
    });

    it("should resolve the dmg path", () => {
      expect(resolveDmgPath).toHaveBeenCalledWith(cachePathDummy);
    });

    it("should detach existing portable preferences", () => {
      expect(detachPortablePreferences).toHaveBeenCalledWith(dmgPathDummy);
    });

    it("should attach portable preferences", () => {
      expect(attachPortablePreferences).toHaveBeenCalledWith(dmgPathDummy);
    });

    it("should trust the portable identifier", () => {
      expect(trustPortableIdentifier).toHaveBeenCalledWith(
        preferencesDirectoryDummy,
      );
    });

    it("should create portable symlinks", () => {
      expect(createPortableSymlinks).toHaveBeenCalledWith(
        preferencesDirectoryDummy,
      );
    });

    it("should restart the preferences daemon", () => {
      expect(restartPreferencesDaemon).toHaveBeenCalled();
    });
  });
});
