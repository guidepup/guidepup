import { detachPortablePreferences } from "./detachPortablePreferences";
import { resolveCachePath } from "../../../resolveCachePath";
import { resolveDmgPath } from "./resolveDmgPath";
import { unmountGuidepupPreferences } from "./unmountGuidepupPreferences";

jest.mock("./detachPortablePreferences", () => ({
  detachPortablePreferences: jest.fn(),
}));
jest.mock("../../../resolveCachePath", () => ({
  resolveCachePath: jest.fn(),
}));
jest.mock("./resolveDmgPath", () => ({
  resolveDmgPath: jest.fn(),
}));

const cachePathDummy = "test-cache-path";
const dmgPathDummy = "test-dmg-path";

describe("unmountGuidepupPreferences", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(resolveCachePath).mockReturnValue(cachePathDummy);
    jest.mocked(resolveDmgPath).mockReturnValue(dmgPathDummy);

    unmountGuidepupPreferences();
  });

  it("should resolve the cache path", () => {
    expect(resolveCachePath).toHaveBeenCalled();
  });

  it("should resolve the dmg path", () => {
    expect(resolveDmgPath).toHaveBeenCalledWith(cachePathDummy);
  });

  it("should detach portable preferences", () => {
    expect(detachPortablePreferences).toHaveBeenCalledWith(dmgPathDummy);
  });
});
