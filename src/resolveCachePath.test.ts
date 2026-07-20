const mockHomedir = "/test-homedir";
const mockLocalAppDataOverride = "/test-local-app-data-override-path";
const mockOverridePath = "/test-override-path";

describe("resolveCachePath", () => {
  let resolveCachePath: () => string;
  let homedir: () => string;
  let platform: () => string;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();

    delete process.env.LOCALAPPDATA;
    delete process.env.GUIDEPUP_SCREEN_READERS_PATH;

    jest.mock("node:os", () => ({
      homedir: jest.fn(),
      platform: jest.fn(),
    }));

    ({ homedir, platform } = await import("node:os"));

    jest.mocked(homedir).mockReturnValue(mockHomedir);
  });

  describe("when on macOS", () => {
    beforeEach(async () => {
      jest.mocked(platform).mockReturnValue("darwin");

      ({ resolveCachePath } = await import("./resolveCachePath"));
    });

    test("should resolve to home directory's library caches directory by default", () => {
      expect(resolveCachePath()).toBe(`${mockHomedir}/Library/Caches/guidepup`);
    });

    test("should resolve to override cache directory when provided", () => {
      process.env.GUIDEPUP_SCREEN_READERS_PATH = mockOverridePath;

      expect(resolveCachePath()).toBe(mockOverridePath);
    });
  });

  describe("when on Windows", () => {
    beforeEach(() => {
      jest.mocked(platform).mockReturnValue("win32");
    });

    test("should resolve to home directory's app data local directory by default", async () => {
      ({ resolveCachePath } = await import("./resolveCachePath"));

      expect(resolveCachePath()).toBe(`${mockHomedir}/AppData/Local/guidepup`);
    });

    test("should resolve to an env var set app data local directory when provided", async () => {
      process.env.LOCALAPPDATA = mockLocalAppDataOverride;

      ({ resolveCachePath } = await import("./resolveCachePath"));

      expect(resolveCachePath()).toBe(`${mockLocalAppDataOverride}/guidepup`);
    });

    test("should resolve to override cache directory when provided", async () => {
      process.env.LOCALAPPDATA = mockLocalAppDataOverride;
      process.env.GUIDEPUP_SCREEN_READERS_PATH = mockOverridePath;

      ({ resolveCachePath } = await import("./resolveCachePath"));

      expect(resolveCachePath()).toBe(mockOverridePath);
    });
  });

  describe("when on an operating system other than macOS and Windows", () => {
    beforeEach(async () => {
      jest.mocked(platform).mockReturnValue("linux");

      ({ resolveCachePath } = await import("./resolveCachePath"));
    });

    test("should resolve to home directory's cache directory by default", () => {
      expect(resolveCachePath()).toBe(`${mockHomedir}/.cache/guidepup`);
    });

    test("should resolve to override cache directory when provided", () => {
      process.env.GUIDEPUP_SCREEN_READERS_PATH = mockOverridePath;

      expect(resolveCachePath()).toBe(mockOverridePath);
    });
  });
});
