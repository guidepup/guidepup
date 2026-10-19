import { ERR_ORCA_FAILED_TO_RESET_GUIDEPUP_SETTINGS } from "../../errors";
import { execFileSync } from "node:child_process";
import { ORCA_GUIDEPUP_DCONF_PATH_PREFIX } from "./constants";
import { resetGuidepupSettings } from "./resetGuidepupSettings";

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
}));

describe("resetGuidepupSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should recursively reset the guidepup profile settings", () => {
    resetGuidepupSettings();

    expect(execFileSync).toHaveBeenCalledWith("dconf", [
      "reset",
      "-f",
      ORCA_GUIDEPUP_DCONF_PATH_PREFIX,
    ]);
  });

  describe("when the settings cannot be reset", () => {
    const stubError = new Error("test-error");

    beforeEach(() => {
      jest.mocked(execFileSync).mockImplementation(() => {
        throw stubError;
      });
    });

    it("should throw with the cause", () => {
      expect(() => resetGuidepupSettings()).toThrow(
        expect.objectContaining({
          message: ERR_ORCA_FAILED_TO_RESET_GUIDEPUP_SETTINGS,
          cause: stubError,
        }),
      );
    });
  });
});
