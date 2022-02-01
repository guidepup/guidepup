import { ChildProcess, exec } from "child_process";
import { enabledDefaults } from "./enabledDefaults";
import { mockType } from "../../../../test/mockType";

jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

describe("enabledDefaults", () => {
  let result;

  const commonCommandAssertions = () => {
    it("should attempt to read the VoiceOver AppleScript control system defaults", () => {
      expect(exec).toHaveBeenCalledWith(
        "defaults read com.apple.VoiceOver4/default SCREnableAppleScript",
        expect.any(Function)
      );
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when the system defaults have AppleScript support enabled", () => {
    beforeEach(async () => {
      mockType(exec).mockImplementation((_command, callback) => {
        callback(null, "\n\t1  \n");

        return {} as unknown as ChildProcess;
      });

      result = await enabledDefaults();
    });

    commonCommandAssertions();

    it("should resolve to true", () => {
      expect(result).toBe(true);
    });
  });

  describe("when the system defaults have AppleScript support disabled", () => {
    beforeEach(async () => {
      mockType(exec).mockImplementation((_command, callback) => {
        callback(null, "\n\t0  \n");

        return {} as unknown as ChildProcess;
      });

      result = await enabledDefaults();
    });

    commonCommandAssertions();

    it("should resolve to false", () => {
      expect(result).toBe(false);
    });
  });

  describe("when an error is thrown trying to access the system defaults", () => {
    beforeEach(async () => {
      mockType(exec).mockImplementation((_command, callback) => {
        callback(new Error("test-error"), "");

        return {} as unknown as ChildProcess;
      });

      result = await enabledDefaults();
    });

    commonCommandAssertions();

    it("should resolve to false", () => {
      expect(result).toBe(false);
    });
  });
});
