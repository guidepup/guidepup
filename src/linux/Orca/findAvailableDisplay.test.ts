import { ERR_ORCA_X_SERVER_DISPLAYS_NOT_AVAILABLE } from "../errors";
import { execFileSync } from "node:child_process";
import { findAvailableDisplay } from "./findAvailableDisplay";

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
}));

describe("findAvailableDisplay", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when display :99 is not in use", () => {
    beforeEach(() => {
      jest.mocked(execFileSync).mockImplementation(() => {
        throw new Error("test-error");
      });
    });

    it("should return :99", () => {
      expect(findAvailableDisplay()).toBe(":99");
    });

    it("should query the display with xdpyinfo", () => {
      findAvailableDisplay();

      expect(execFileSync).toHaveBeenCalledWith("xdpyinfo", [
        "-display",
        ":99",
      ]);
    });
  });

  describe("when the first displays are in use", () => {
    beforeEach(() => {
      jest.mocked(execFileSync).mockImplementation((_command, args) => {
        if (args[1] === ":102") {
          throw new Error("test-error");
        }

        return Buffer.from("");
      });
    });

    it("should return the first display that is not in use", () => {
      expect(findAvailableDisplay()).toBe(":102");
    });
  });

  describe("when every display is in use", () => {
    beforeEach(() => {
      jest.mocked(execFileSync).mockReturnValue(Buffer.from(""));
    });

    it("should throw", () => {
      expect(() => findAvailableDisplay()).toThrow(
        ERR_ORCA_X_SERVER_DISPLAYS_NOT_AVAILABLE,
      );
    });

    it("should try displays :99 to :199", () => {
      try {
        findAvailableDisplay();
      } catch {
        // swallow
      }

      expect(execFileSync).toHaveBeenCalledTimes(101);
      expect(execFileSync).toHaveBeenLastCalledWith("xdpyinfo", [
        "-display",
        ":199",
      ]);
    });
  });
});
