import { getConfig } from "./getConfig";
import { getConfigKey } from "./getConfigKey";

jest.mock("./getConfig", () => ({
  getConfig: jest.fn(),
}));

const keyDummy = "test-key";
const valueDummy = "test-value";

describe("getConfigKey", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when the config exists", () => {
    beforeEach(() => {
      jest.mocked(getConfig).mockReturnValue({
        [keyDummy]: valueDummy,
      });
    });

    it("should return the config value", () => {
      expect(getConfigKey(keyDummy)).toBe(valueDummy);
    });

    it("should get config", () => {
      getConfigKey(keyDummy);

      expect(getConfig).toHaveBeenCalled();
    });
  });

  describe("when the config does not exist", () => {
    beforeEach(() => {
      jest.mocked(getConfig).mockReturnValue({});
    });

    it("should return undefined", () => {
      expect(getConfigKey(keyDummy)).toBeUndefined();
    });

    it("should get config", () => {
      getConfigKey(keyDummy);

      expect(getConfig).toHaveBeenCalled();
    });
  });
});
