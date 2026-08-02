import { ERR_NO_AVAILABLE_SUPPORTED_SCREEN_READERS } from "./errors";
import { nvda } from "./windows";
import { ScreenReader } from "./ScreenReader";
import { voiceOver } from "./macOS";

jest.mock("./windows", () => ({
  nvda: {
    default: jest.fn(),
    name: "NVDA",
    version: "test-nvda-version",
  },
}));

jest.mock("./macOS", () => ({
  voiceOver: {
    default: jest.fn(),
    name: "VoiceOver",
    version: "test-vo-version",
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

    describe("version", () => {
      it("should return the VoiceOver version", () => {
        const screenReader = new ScreenReader();

        expect(screenReader.version).toBe("test-vo-version");
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

    describe("version", () => {
      it("should return the NVDA version", () => {
        const screenReader = new ScreenReader();

        expect(screenReader.version).toBe("test-nvda-version");
      });
    });
  });

  describe("when neither VoiceOver nor NVDA is the default screen reader for the environment", () => {
    beforeEach(() => {
      jest.mocked(nvda.default).mockReturnValue(false);
      jest.mocked(voiceOver.default).mockReturnValue(false);
    });

    it("should throw an error", () => {
      expect(() => new ScreenReader()).toThrow(
        new Error(ERR_NO_AVAILABLE_SUPPORTED_SCREEN_READERS),
      );
    });
  });
});
