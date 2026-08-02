jest.mock("../../../../manifest.json", () => ({
  screenReaders: [
    {
      id: "nvda",
      assets: [
        {
          version: "test-version",
        },
      ],
    },
  ],
}));

import { resolveCachePath } from "../../../resolveCachePath";
import { resolveGuidepupUserConfigPath } from "./resolveGuidepupUserConfigPath";

jest.mock("../../../resolveCachePath", () => ({
  resolveCachePath: jest.fn(),
}));

const cachePathDummy = "test-cache-path";

describe("resolveGuidepupUserConfigPath", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(resolveCachePath).mockReturnValue(cachePathDummy);
  });

  it("should resolve the cache path", () => {
    resolveGuidepupUserConfigPath();

    expect(resolveCachePath).toHaveBeenCalled();
  });

  it("should resolve the Guidepup user config path", () => {
    expect(resolveGuidepupUserConfigPath()).toBe(
      "test-cache-path/nvda/all/test-version/extracted/userConfig",
    );
  });
});
