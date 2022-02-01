import { access, constants } from "fs";
import { enabledDbFile } from "./enabledDbFile";
import { mockType } from "../../../../test/mockType";

jest.mock("fs", () => ({
  access: jest.fn(),
  constants: {
    F_OK: Symbol("dummy-f-ok-constant"),
  },
}));

describe("enabledDbFile", () => {
  let result;

  const commonAccessAssertions = () => {
    it("should attempt to check the '.VoiceOverAppleScriptEnabled' database file exists", () => {
      expect(access).toHaveBeenCalledWith(
        "/private/var/db/Accessibility/.VoiceOverAppleScriptEnabled",
        constants.F_OK,
        expect.any(Function)
      );
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when the '.VoiceOverAppleScriptEnabled' database file exists", () => {
    beforeEach(async () => {
      mockType(access).mockImplementation((_path, _mode, callback) => {
        callback(null);
      });

      result = await enabledDbFile();
    });

    commonAccessAssertions();

    it("should resolve to true", () => {
      expect(result).toBe(true);
    });
  });

  describe("when the '.VoiceOverAppleScriptEnabled' database file doesn't exist", () => {
    beforeEach(async () => {
      mockType(access).mockImplementation((_path, _mode, callback) => {
        callback(new Error("test-error"));
      });

      result = await enabledDbFile();
    });

    commonAccessAssertions();

    it("should resolve to false", () => {
      expect(result).toBe(false);
    });
  });
});
