import { ERR_WINDOWS_UNABLE_TO_ACCESS_REGISTRY } from "../errors";
import { SUB_KEY_GUIDEPUP_NVDA } from "./constants";

const nvdaRegistryDataStub = {
  [SUB_KEY_GUIDEPUP_NVDA]: Symbol("test-data"),
};

describe("getNVDARegistryData", () => {
  let regedit;
  let getNVDARegistryData;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();

    jest.mock("regedit", () => ({
      promisified: {
        list: jest.fn(),
      },
    }));

    ({ promisified: regedit } = await import("regedit"));
    ({ getNVDARegistryData } = await import("./getNVDARegistryData"));
  });

  describe("when called for the first time", () => {
    let resultPromise;

    beforeEach(() => {
      regedit.list.mockResolvedValue(nvdaRegistryDataStub);

      resultPromise = getNVDARegistryData();
    });

    afterEach(async () => {
      try {
        await resultPromise;
      } catch {
        // swallow
      }
    });

    it("should interrogate the registry against the guidepup key", () => {
      expect(regedit.list).toHaveBeenCalledWith([SUB_KEY_GUIDEPUP_NVDA]);
    });

    it("should return the data", async () => {
      await expect(resultPromise).resolves.toBe(
        nvdaRegistryDataStub[SUB_KEY_GUIDEPUP_NVDA]
      );
    });

    describe("when called again", () => {
      beforeEach(() => {
        jest.clearAllMocks();

        resultPromise = getNVDARegistryData();
      });

      it("should not interrogate the registry again", () => {
        expect(regedit.list).not.toHaveBeenCalled();
      });

      it("should return the same data", async () => {
        await expect(resultPromise).resolves.toBe(
          nvdaRegistryDataStub[SUB_KEY_GUIDEPUP_NVDA]
        );
      });
    });
  });

  describe("when interrogating the registry throws an error", () => {
    const registryErrorStub = new Error("test-registry-error");

    beforeEach(() => {
      regedit.list.mockRejectedValue(registryErrorStub);
    });

    it("should throw a registry access error", async () => {
      await expect(getNVDARegistryData()).rejects.toThrow(
        new Error(
          `${ERR_WINDOWS_UNABLE_TO_ACCESS_REGISTRY}\n${registryErrorStub.message}`
        )
      );
    });
  });
});
