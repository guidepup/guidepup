import { DEFAULT_NVDA_PATH } from "./constants";
import { ERR_NVDA_QUIT } from "../errors";
import { mockType } from "../../../test/mockType";
import { quit } from "./quit";
import { spawnSync } from "child_process";

jest.mock("child_process", () => ({
  spawnSync: jest.fn(),
}));

describe("quit", () => {
  describe("when no error is thrown", () => {
    beforeEach(() => {
      quit();
    });

    it("should spawn a shell to run the nvda --quit command without stdio", () => {
      expect(spawnSync).toHaveBeenCalledWith(
        `"${DEFAULT_NVDA_PATH}"`,
        ["--quit"],
        { shell: true, stdio: "ignore" }
      );
    });
  });

  describe("when quitting throws an error", () => {
    const mockError = new Error("test-error");

    let error;

    beforeEach(() => {
      mockType(spawnSync).mockImplementation(() => {
        throw mockError;
      });

      try {
        quit();
      } catch (e) {
        error = e;
      }
    });

    it("should spawn a shell to run the nvda --quit command without stdio", () => {
      expect(spawnSync).toHaveBeenCalledWith(
        `"${DEFAULT_NVDA_PATH}"`,
        ["--quit"],
        { shell: true, stdio: "ignore" }
      );
    });

    it("should throw a wrapped error", () => {
      expect(error).toEqual(
        new Error(`${ERR_NVDA_QUIT}\n${mockError.message}`)
      );
    });
  });
});
