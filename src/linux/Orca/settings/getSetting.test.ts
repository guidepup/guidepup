import { getSetting } from "./getSetting";
import { getSettings } from "./getSettings";

jest.mock("./getSettings", () => ({
  getSettings: jest.fn(),
}));

const stubValue = Symbol("test-value");

describe("getSetting", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(getSettings).mockReturnValue({
      "test-key": stubValue,
      "test-other-key": Symbol("test-other-value"),
    });
  });

  it("should return the value of the requested setting", () => {
    expect(getSetting("test-key")).toBe(stubValue);
  });

  it("should return undefined for a setting that is not set", () => {
    expect(getSetting("test-unset-key")).toBeUndefined();
  });

  describe("when the settings cannot be read", () => {
    const stubError = new Error("test-error");

    beforeEach(() => {
      jest.mocked(getSettings).mockImplementation(() => {
        throw stubError;
      });
    });

    it("should throw", () => {
      expect(() => getSetting("test-key")).toThrow(stubError);
    });
  });
});
