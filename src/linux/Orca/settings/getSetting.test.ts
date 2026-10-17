import { getSetting } from "./getSetting";
import { getSettings } from "./getSettings";

jest.mock("./getSettings", () => ({
  getSettings: jest.fn(),
}));

describe("getSetting", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(getSettings).mockReturnValue({
      "speech/enable": true,
      "voice/rate": 100,
    });
  });

  it("should return the value of the requested setting", () => {
    expect(getSetting("voice/rate")).toBe(100);
  });

  it("should return undefined for a setting that is not set", () => {
    expect(getSetting("voice/pitch")).toBeUndefined();
  });

  describe("when the settings cannot be read", () => {
    const stubError = new Error("test-error");

    beforeEach(() => {
      jest.mocked(getSettings).mockImplementation(() => {
        throw stubError;
      });
    });

    it("should throw", () => {
      expect(() => getSetting("voice/rate")).toThrow(stubError);
    });
  });
});
