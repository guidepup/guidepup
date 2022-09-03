import { spawnSync, SpawnSyncReturns } from "child_process";
import { DEFAULT_NVDA_PATH } from "./constants";
import { isRunning } from "./isRunning";
import { mockType } from "../../../test/mockType";

jest.mock("child_process", () => ({
  spawnSync: jest.fn(),
}));

describe("isRunning", () => {
  let result;

  describe("when NVDA is running", () => {
    beforeEach(() => {
      mockType(spawnSync).mockReturnValue({
        status: 0,
      } as SpawnSyncReturns<Buffer>);

      result = isRunning();
    });

    it("should spawn a shell to run the nvda --isRunning command without stdio", () => {
      expect(spawnSync).toHaveBeenCalledWith(
        `"${DEFAULT_NVDA_PATH}"`,
        ["--check-running"],
        { shell: true, stdio: "ignore" }
      );
    });

    it("should return true", () => {
      expect(result).toBeTruthy();
    });
  });

  describe("when NVDA is not running", () => {
    beforeEach(() => {
      mockType(spawnSync).mockReturnValue({
        status: 1,
      } as SpawnSyncReturns<Buffer>);

      result = isRunning();
    });

    it("should spawn a shell to run the nvda --isRunning command without stdio", () => {
      expect(spawnSync).toHaveBeenCalledWith(
        `"${DEFAULT_NVDA_PATH}"`,
        ["--check-running"],
        { shell: true, stdio: "ignore" }
      );
    });

    it("should return false", () => {
      expect(result).toBeFalsy();
    });
  });

  describe("when the running check command throws an error", () => {
    const mockError = new Error("test-error");

    beforeEach(() => {
      mockType(spawnSync).mockImplementation(() => {
        throw mockError;
      });

      result = isRunning();
    });

    it("should spawn a shell to run the nvda --isRunning command without stdio", () => {
      expect(spawnSync).toHaveBeenCalledWith(
        `"${DEFAULT_NVDA_PATH}"`,
        ["--check-running"],
        { shell: true, stdio: "ignore" }
      );
    });

    it("should return false", () => {
      expect(result).toBeFalsy();
    });
  });
});
