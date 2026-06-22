import { ERR_NO_AVAILABLE_SUPPORTED_SCREEN_READERS } from "./errors";
import { nvda } from "./windows";
import { ScreenReader } from "./ScreenReader";
import { voiceOver } from "./macOS";

jest.mock("./windows", () => ({
  nvda: {
    default: jest.fn(),
    name: "NVDA",
  },
}));

jest.mock("./macOS", () => ({
  voiceOver: {
    default: jest.fn(),
    name: "VoiceOver",
  },
}));

describe("ScreenReader", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("when VoiceOver is the default screen reader for the environment", () => {
    beforeEach(() => {
      jest.mocked(nvda.default).mockReturnValue(false);
      jest.mocked(voiceOver.default).mockReturnValue(true);
    });

    describe("name", () => {
      it("should return VoiceOver", () => {
        const screenReader = new ScreenReader();

        expect(screenReader.name).toBe("VoiceOver");
      });
    });
  });

  describe("when NVDA is the default screen reader for the environment", () => {
    beforeEach(() => {
      jest.mocked(nvda.default).mockReturnValue(true);
      jest.mocked(voiceOver.default).mockReturnValue(false);
    });

    describe("name", () => {
      it("should return NVDA", () => {
        const screenReader = new ScreenReader();

        expect(screenReader.name).toBe("NVDA");
      });
    });
  });

  describe("when neither VoiceOver nor NVDA is the default screen reader for the environment", () => {
    beforeEach(() => {
      jest.mocked(nvda.default).mockReturnValue(false);
      jest.mocked(voiceOver.default).mockReturnValue(false);
    });

    describe("name", () => {
      it("should return NVDA", () => {
        expect(() => new ScreenReader()).toThrow(
          new Error(ERR_NO_AVAILABLE_SUPPORTED_SCREEN_READERS),
        );
      });
    });
  });
});
