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
import { resolveSessionUserConfigPath } from "./resolveSessionUserConfigPath";

jest.mock("../../../resolveCachePath", () => ({
  resolveCachePath: jest.fn(),
}));

const cachePathDummy = "test-cache-path";

describe("resolveSessionUserConfigPath", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(resolveCachePath).mockReturnValue(cachePathDummy);
  });

  it("should resolve the cache path", () => {
    resolveSessionUserConfigPath();

    expect(resolveCachePath).toHaveBeenCalled();
  });

  it("should resolve the session user config path", () => {
    expect(resolveSessionUserConfigPath()).toBe(
      "test-cache-path/nvda/all/test-version/sessionUserConfig",
    );
  });
});
