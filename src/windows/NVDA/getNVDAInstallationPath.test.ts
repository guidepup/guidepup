describe("getNVDAInstallationPath", () => {
  let getNVDARegistryData;
  let getNVDAInstallationPath;
  let getNVDARegistryDataResolver;
  let getNVDARegistryDataRejecter;
  let existsSync;
  let path;

  beforeEach(async () => {
    getNVDARegistryDataResolver = undefined;

    jest.clearAllMocks();
    jest.resetModules();

    jest.mock("fs", () => ({
      existsSync: jest.fn(),
    }));
    jest.mock("./getNVDARegistryData", () => ({
      getNVDARegistryData: jest.fn(),
    }));

    ({ getNVDARegistryData } = await import("./getNVDARegistryData"));
    ({ existsSync } = await import("fs"));
    path = await import("path");
    ({ getNVDAInstallationPath } = await import("./getNVDAInstallationPath"));
  });

  describe("when called for the first time", () => {
    let resultPromise;

    beforeEach(() => {
      const getNVDARegistryDataPromise = new Promise((resolve, reject) => {
        getNVDARegistryDataResolver = resolve;
        getNVDARegistryDataRejecter = reject;
      });

      getNVDARegistryData.mockReturnValue(getNVDARegistryDataPromise);

      resultPromise = getNVDAInstallationPath();
    });

    afterEach(async () => {
      getNVDARegistryDataResolver({ exists: false, values: {} });

      try {
        await resultPromise;
      } catch {
        // swallow
      }
    });

    it("should get the NVDA Registry data", () => {
      expect(getNVDARegistryData).toHaveBeenCalled();
    });

    describe("when getting registry data throws an error", () => {
      const errorStub = new Error("test-registry-error");

      beforeEach(() => {
        getNVDARegistryDataRejecter(errorStub);
      });

      it("should transparently throw on the error to parent calling functions", async () => {
        await expect(resultPromise).rejects.toThrow(errorStub);
      });
    });

    describe("when the registry data doesn't exist", () => {
      beforeEach(() => {
        getNVDARegistryDataResolver({ exists: false, values: {} });
      });

      it("should resolve to null", async () => {
        await expect(resultPromise).resolves.toBeNull();
      });
    });

    describe("when the registry data exists but contains no valid entries", () => {
      beforeEach(() => {
        getNVDARegistryDataResolver({ exists: true, values: {} });
      });

      it("should resolve to null", async () => {
        await expect(resultPromise).resolves.toBeNull();
      });
    });

    describe("when the registry data exists but the directory path is missing from the entry", () => {
      beforeEach(() => {
        getNVDARegistryDataResolver({
          exists: true,
          values: { "guidepup_nvda_1.0.0": { value: "" } },
        });
      });

      it("should resolve to null", async () => {
        await expect(resultPromise).resolves.toBeNull();
      });
    });

    describe("when the registry data exists but the referenced directory doesn't exist", () => {
      let expectedFilePath;

      const directoryValueStub = "test-guidepup-nvda-directory";

      beforeEach(() => {
        existsSync.mockReturnValue(false);

        expectedFilePath = directoryValueStub + path.sep + "nvda.exe";

        getNVDARegistryDataResolver({
          exists: true,
          values: { "guidepup_nvda_1.0.0": { value: directoryValueStub } },
        });
      });

      it("should check if the referenced directory exists", () => {
        expect(existsSync).toHaveBeenCalledWith(expectedFilePath);
      });

      it("should resolve to null", async () => {
        await expect(resultPromise).resolves.toBeNull();
      });
    });

    describe("when the registry data exists and the referenced directory exists", () => {
      let expectedFilePath;

      const directoryValueStub = "test-guidepup-nvda-directory";

      beforeEach(() => {
        existsSync.mockReturnValue(true);

        expectedFilePath = directoryValueStub + path.sep + "nvda.exe";

        getNVDARegistryDataResolver({
          exists: true,
          values: {
            "guidepup_nvda_1.0.0-1.2.3": { value: directoryValueStub },
            "guidepup_nvda_0.9.0-1.2.3": { value: "test-value" },
            "guidepup_nvda_0.8.0": { value: "test-value" },
          },
        });
      });

      it("should check if the referenced directory exists", () => {
        expect(existsSync).toHaveBeenCalledWith(expectedFilePath);
      });

      it("should resolve to the path", async () => {
        await expect(resultPromise).resolves.toBe(expectedFilePath);
      });

      describe("when called again", () => {
        beforeEach(async () => {
          jest.clearAllMocks();

          await getNVDAInstallationPath();
        });

        it("should not get the registry data again", () => {
          expect(getNVDARegistryData).not.toHaveBeenCalled();
        });

        it("should resolve to the same path", async () => {
          await expect(resultPromise).resolves.toBe(expectedFilePath);
        });
      });
    });
  });
});
