import { ERR_NO_AVAILABLE_SUPPORTED_SCREEN_READERS } from "./errors";
import { NVDA } from "./windows/NVDA/NVDA";
import { ScreenReader } from "./ScreenReader";
import { VoiceOver } from "./macOS/VoiceOver/VoiceOver";

jest.mock("./windows/NVDA/NVDA", () => ({
  NVDA: jest.fn(),
}));

jest.mock("./macOS/VoiceOver/VoiceOver", () => ({
  VoiceOver: jest.fn(),
}));

const NVDAStub = {
  default: jest.fn(),
  name: "NVDA",
};
const VoiceOverStub = {
  default: jest.fn(),
  name: "VoiceOver",
};

describe("ScreenReader", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    jest
      .mocked(VoiceOver)
      .mockImplementation(() => VoiceOverStub as unknown as VoiceOver);

    jest.mocked(VoiceOver).default = VoiceOverStub.default;

    jest.mocked(NVDA).mockImplementation(() => NVDAStub as unknown as NVDA);

    jest.mocked(NVDA).default = NVDAStub.default;
  });

  describe("when VoiceOver is the default screen reader for the environment", () => {
    beforeEach(() => {
      NVDAStub.default.mockReturnValue(false);
      VoiceOverStub.default.mockReturnValue(true);
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
      NVDAStub.default.mockReturnValue(true);
      VoiceOverStub.default.mockReturnValue(false);
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
      NVDAStub.default.mockReturnValue(false);
      VoiceOverStub.default.mockReturnValue(false);
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
