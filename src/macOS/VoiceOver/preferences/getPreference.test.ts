import { getPreference } from "./getPreference";
import { getPreferences } from "./getPreferences";

jest.mock("./getPreferences", () => ({
  getPreferences: jest.fn(),
}));

const keyDummy = "test-key";
const valueDummy = "test-value";

describe("getPreference", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when the preference exists", () => {
    beforeEach(() => {
      jest.mocked(getPreferences).mockReturnValue({
        [keyDummy]: valueDummy,
      });
    });

    it("should return the preference value", () => {
      expect(getPreference(keyDummy)).toBe(valueDummy);
    });

    it("should get preferences", () => {
      getPreference(keyDummy);

      expect(getPreferences).toHaveBeenCalled();
    });
  });

  describe("when the preference does not exist", () => {
    beforeEach(() => {
      jest.mocked(getPreferences).mockReturnValue({});
    });

    it("should return undefined", () => {
      expect(getPreference(keyDummy)).toBeUndefined();
    });

    it("should get preferences", () => {
      getPreference(keyDummy);

      expect(getPreferences).toHaveBeenCalled();
    });
  });
});
