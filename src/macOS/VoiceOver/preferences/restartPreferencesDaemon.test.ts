import { execFileSync } from "node:child_process";
import { restartPreferencesDaemon } from "./restartPreferencesDaemon";

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
}));

describe("restartPreferencesDaemon", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when called", () => {
    beforeEach(() => {
      restartPreferencesDaemon();
    });

    it("should restart the preferences daemon", () => {
      expect(execFileSync).toHaveBeenCalledWith(
        "/usr/bin/killall",
        ["cfprefsd"],
        { stdio: "ignore" },
      );
    });
  });

  describe("when restarting the preferences daemon fails", () => {
    beforeEach(() => {
      jest.mocked(execFileSync).mockImplementation(() => {
        throw new Error("test-error");
      });
    });

    it("should swallow the error", () => {
      expect(() => restartPreferencesDaemon()).not.toThrow();
    });
  });
});
