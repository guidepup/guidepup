jest.mock("fs", () => ({
  accessSync: jest.fn(),
}));

describe("isNVDAInstalled", () => {
  let accessSync;
  let DEFAULT_NVDA_PATH;
  let isNVDAInstalled;
  let mockType;
  let result;

  beforeEach(() => {
    result = undefined;

    jest.resetModules();

    ({ accessSync } = require("fs"));
    ({ DEFAULT_NVDA_PATH } = require("./constants"));
    ({ isNVDAInstalled } = require("./isNVDAInstalled"));
    ({ mockType } = require("../../../test/mockType"));
  });

  describe("when NVDA is installed", () => {
    beforeEach(() => {
      result = isNVDAInstalled();
    });

    it("should try to access the NVDA installation location", () => {
      expect(accessSync).toHaveBeenCalledWith(DEFAULT_NVDA_PATH);
    });

    it("should return true", () => {
      expect(result).toBeTruthy();
    });

    describe("when checking if NVDA is installed subsequently", () => {
      beforeEach(() => {
        jest.clearAllMocks();

        result = isNVDAInstalled();
      });

      it("should not try to access the NVDA installation location as it will used a cached result", () => {
        expect(accessSync).not.toHaveBeenCalled();
      });

      it("should return true", () => {
        expect(result).toBeTruthy();
      });
    });
  });

  describe("when NVDA is not installed", () => {
    beforeEach(() => {
      mockType(accessSync).mockImplementation(() => {
        throw new Error("test-error");
      });

      result = isNVDAInstalled();
    });

    it("should try to access the NVDA installation location", () => {
      expect(accessSync).toHaveBeenCalledWith(DEFAULT_NVDA_PATH);
    });

    it("should return false", () => {
      expect(result).toBeFalsy();
    });

    describe("when checking if NVDA is installed subsequently", () => {
      beforeEach(() => {
        jest.clearAllMocks();

        result = isNVDAInstalled();
      });

      it("should not try to access the NVDA installation location as it will used a cached result", () => {
        expect(accessSync).not.toHaveBeenCalled();
      });

      it("should return false", () => {
        expect(result).toBeFalsy();
      });
    });
  });
});
