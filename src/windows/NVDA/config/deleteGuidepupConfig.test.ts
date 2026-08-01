import { deleteGuidepupConfig } from "./deleteGuidepupConfig";
import { resolveSessionUserConfigPath } from "./resolveSessionUserConfigPath";
import { rmSync } from "node:fs";

jest.mock("node:fs", () => ({
  rmSync: jest.fn(),
}));

jest.mock("./resolveSessionUserConfigPath", () => ({
  resolveSessionUserConfigPath: jest.fn(),
}));

const sessionUserConfigPathDummy = "test-session-user-config";

describe("deleteGuidepupConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest
      .mocked(resolveSessionUserConfigPath)
      .mockReturnValue(sessionUserConfigPathDummy);
  });

  it("should resolve the session user config path", () => {
    deleteGuidepupConfig();

    expect(resolveSessionUserConfigPath).toHaveBeenCalled();
  });

  it("should remove the session user config", () => {
    deleteGuidepupConfig();

    expect(rmSync).toHaveBeenCalledWith(sessionUserConfigPathDummy, {
      recursive: true,
      force: true,
    });
  });

  describe("when removing the session user config fails", () => {
    beforeEach(() => {
      jest.mocked(rmSync).mockImplementation(() => {
        throw new Error("test-error");
      });
    });

    it("should swallow the error", () => {
      deleteGuidepupConfig();

      expect(rmSync).toHaveBeenCalledWith(sessionUserConfigPathDummy, {
        recursive: true,
        force: true,
      });
    });
  });
});
