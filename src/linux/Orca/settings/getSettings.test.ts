import { ERR_ORCA_FAILED_TO_GET_SETTINGS } from "../../errors";
import { execFileSync } from "node:child_process";
import { getSettings } from "./getSettings";
import { ORCA_GUIDEPUP_DCONF_PATH_PREFIX } from "./constants";

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
}));

const mockDump = `
# test-comment
test-orphan-key=true

[test-section-1]
test-true=true
test-false=false
test-string='test value'

[test-section-2]
test-integer=100
test-negative-integer=-5
test-float=1.5
test-negative-float=-0.5
test-no-separator
test-array=['test-item-1', 'test-item-2']
test-empty-array=[]
test-unparsed=@as []
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
        "test-section-1/test-true": true,
        "test-section-1/test-false": false,
        "test-section-1/test-string": "test value",
        "test-section-2/test-integer": 100,
        "test-section-2/test-negative-integer": -5,
        "test-section-2/test-float": 1.5,
        "test-section-2/test-negative-float": -0.5,
        "test-section-2/test-array": ["test-item-1", "test-item-2"],
        "test-section-2/test-empty-array": [],
        "test-section-2/test-unparsed": "@as []",
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
