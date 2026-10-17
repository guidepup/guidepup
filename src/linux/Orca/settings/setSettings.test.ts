import { ERR_ORCA_FAILED_TO_SET_SETTING } from "../../errors";
import { execFileSync } from "node:child_process";
import { ORCA_GUIDEPUP_DCONF_PATH_PREFIX } from "./constants";
import { setSettings } from "./setSettings";

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
}));

describe("setSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each`
    description                       | value                         | expected
    ${"a boolean"}                    | ${false}                      | ${"false"}
    ${"a number"}                     | ${1.5}                        | ${"1.5"}
    ${"a string"}                     | ${"Default Voice"}            | ${"'Default Voice'"}
    ${"a string needing escapes"}     | ${"it's a \\ path"}           | ${"'it\\'s a \\\\ path'"}
    ${"an array"}                     | ${["en", "fr"]}               | ${"['en', 'fr']"}
    ${"an empty array"}               | ${[]}                         | ${"[]"}
    ${"a dictionary of mixed values"} | ${{ family: "x", rate: 100 }} | ${"{'family': 'x', 'rate': 100}"}
  `("should write $description as GVariant", ({ value, expected }) => {
    setSettings({ "voice/test": value });

    expect(execFileSync).toHaveBeenCalledWith("dconf", [
      "write",
      `${ORCA_GUIDEPUP_DCONF_PATH_PREFIX}voice/test`,
      expected,
    ]);
  });

  it("should write every setting", () => {
    setSettings({ "speech/enable": true, "voice/rate": 100 });

    expect(execFileSync).toHaveBeenCalledTimes(2);
    expect(execFileSync).toHaveBeenNthCalledWith(1, "dconf", [
      "write",
      `${ORCA_GUIDEPUP_DCONF_PATH_PREFIX}speech/enable`,
      "true",
    ]);
    expect(execFileSync).toHaveBeenNthCalledWith(2, "dconf", [
      "write",
      `${ORCA_GUIDEPUP_DCONF_PATH_PREFIX}voice/rate`,
      "100",
    ]);
  });

  describe.each`
    description    | value
    ${"null"}      | ${null}
    ${"undefined"} | ${undefined}
  `("when a value is $description", ({ value }) => {
    it("should throw with an unsupported value cause", () => {
      expect(() => setSettings({ "voice/test": value })).toThrow(
        expect.objectContaining({
          message: ERR_ORCA_FAILED_TO_SET_SETTING,
          cause: expect.any(TypeError),
        }),
      );
    });

    it("should not write it", () => {
      try {
        setSettings({ "voice/test": value });
      } catch {
        // swallow
      }

      expect(execFileSync).not.toHaveBeenCalled();
    });
  });

  describe("when a setting cannot be written", () => {
    const stubError = new Error("test-error");

    beforeEach(() => {
      jest.mocked(execFileSync).mockImplementation(() => {
        throw stubError;
      });
    });

    it("should throw with the cause", () => {
      expect(() => setSettings({ "voice/rate": 100 })).toThrow(
        expect.objectContaining({
          message: ERR_ORCA_FAILED_TO_SET_SETTING,
          cause: stubError,
        }),
      );
    });
  });
});
