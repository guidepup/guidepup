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
    description                       | value                                                | expected
    ${"a boolean"}                    | ${false}                                             | ${"false"}
    ${"a number"}                     | ${1.5}                                               | ${"1.5"}
    ${"a string"}                     | ${"test value"}                                      | ${"'test value'"}
    ${"a string needing escapes"}     | ${"it's a \\ path"}                                  | ${"'it\\'s a \\\\ path'"}
    ${"an array"}                     | ${["test-item-1", "test-item-2"]}                    | ${"['test-item-1', 'test-item-2']"}
    ${"an empty array"}               | ${[]}                                                | ${"[]"}
    ${"a dictionary of mixed values"} | ${{ "test-key-1": "test-value", "test-key-2": 100 }} | ${"{'test-key-1': 'test-value', 'test-key-2': 100}"}
  `("should write $description as GVariant", ({ value, expected }) => {
    setSettings({ "test-key": value });

    expect(execFileSync).toHaveBeenCalledWith("dconf", [
      "write",
      `${ORCA_GUIDEPUP_DCONF_PATH_PREFIX}test-key`,
      expected,
    ]);
  });

  it("should write every setting", () => {
    setSettings({ "test-key-1": true, "test-key-2": 100 });

    expect(execFileSync).toHaveBeenCalledTimes(2);
    expect(execFileSync).toHaveBeenNthCalledWith(1, "dconf", [
      "write",
      `${ORCA_GUIDEPUP_DCONF_PATH_PREFIX}test-key-1`,
      "true",
    ]);
    expect(execFileSync).toHaveBeenNthCalledWith(2, "dconf", [
      "write",
      `${ORCA_GUIDEPUP_DCONF_PATH_PREFIX}test-key-2`,
      "100",
    ]);
  });

  describe.each`
    description    | value
    ${"null"}      | ${null}
    ${"undefined"} | ${undefined}
  `("when a value is $description", ({ value }) => {
    it("should throw with an unsupported value cause", () => {
      expect(() => setSettings({ "test-key": value })).toThrow(
        expect.objectContaining({
          message: ERR_ORCA_FAILED_TO_SET_SETTING,
          cause: expect.any(TypeError),
        }),
      );
    });

    it("should not write it", () => {
      try {
        setSettings({ "test-key": value });
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
      expect(() => setSettings({ "test-key": 100 })).toThrow(
        expect.objectContaining({
          message: ERR_ORCA_FAILED_TO_SET_SETTING,
          cause: stubError,
        }),
      );
    });
  });
});
