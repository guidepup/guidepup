import { ERR_ORCA_FAILED_TO_GET_SETTINGS } from "../../errors";
import { execFileSync } from "node:child_process";
import { getSettings } from "./getSettings";
import { ORCA_GUIDEPUP_DCONF_PATH_PREFIX } from "./constants";

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
}));

const mockDump = `
# a comment
orphan=true

[speech]
enable=true
verbalize-punctuation=false
voice-family='Default Voice'

[voice]
rate=100
pitch=-5
volume=1.5
negative-volume=-0.5
no-separator
languages=['en', 'fr']
empty=[]
typed-empty=@as []
`;

describe("getSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when the settings can be read", () => {
    let result: Record<string, unknown>;

    beforeEach(() => {
      jest.mocked(execFileSync).mockReturnValue(mockDump);

      result = getSettings();
    });

    it("should dump the guidepup profile settings", () => {
      expect(execFileSync).toHaveBeenCalledWith(
        "dconf",
        ["dump", ORCA_GUIDEPUP_DCONF_PATH_PREFIX],
        { encoding: "utf8" },
      );
    });

    it("should key each setting by its section and name, parsing the values", () => {
      expect(result).toEqual({
        "speech/enable": true,
        "speech/verbalize-punctuation": false,
        "speech/voice-family": "Default Voice",
        "voice/rate": 100,
        "voice/pitch": -5,
        "voice/volume": 1.5,
        "voice/negative-volume": -0.5,
        "voice/languages": ["en", "fr"],
        "voice/empty": [],
        "voice/typed-empty": "@as []",
      });
    });
  });

  describe("when the settings cannot be read", () => {
    const stubError = new Error("test-error");

    beforeEach(() => {
      jest.mocked(execFileSync).mockImplementation(() => {
        throw stubError;
      });
    });

    it("should throw with the cause", () => {
      expect(() => getSettings()).toThrow(
        expect.objectContaining({
          message: ERR_ORCA_FAILED_TO_GET_SETTINGS,
          cause: stubError,
        }),
      );
    });
  });
});
