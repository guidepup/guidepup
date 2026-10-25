import { activate } from "../activate";
import { Applications } from "../Applications";
import { DEFAULT_TIMEOUT } from "../../constants";
import { delay } from "../../delay";
import { ERR_VOICE_OVER_CANNOT_BE_STARTED } from "../errors";
import { execFileSync } from "child_process";
import { start } from "./start";
import { waitForReady } from "./waitForReady";

jest.mock("child_process", () => ({
  execFileSync: jest.fn(),
}));
jest.mock("../activate", () => ({
  activate: jest.fn(),
}));
jest.mock("../../delay", () => ({
  delay: jest.fn(),
}));
jest.mock("./waitForReady", () => ({
  waitForReady: jest.fn(),
}));

const options = { timeout: 1234 };

describe("when starting VoiceOver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(execFileSync).mockReset();
  });

  describe("when asking VoiceOver to start succeeds", () => {
    beforeEach(async () => {
      await start(options);
    });

    test("should ask VoiceOver to start with libScreenReader", () => {
      expect(execFileSync).toHaveBeenCalledWith(
        "/usr/bin/osascript",
        [
          "-l",
          "JavaScript",
          "-e",
          expect.stringContaining("_ScreenReaderStart(0)"),
        ],
        { stdio: "ignore", timeout: DEFAULT_TIMEOUT },
      );
    });

    test("should wait for VoiceOver to be ready, then bring it to the foreground", () => {
      expect(waitForReady).toHaveBeenCalledWith(options);
      expect(delay).toHaveBeenCalledWith(500);
      expect(activate).toHaveBeenCalledWith(Applications.VoiceOver, options);
      expect(
        jest.mocked(waitForReady).mock.invocationCallOrder[0],
      ).toBeLessThan(jest.mocked(activate).mock.invocationCallOrder[0]);
    });
  });

  describe("when asking VoiceOver to start fails", () => {
    const error = new Error("osascript failed");

    test("should reject with a startup error caused by the failure", async () => {
      jest.mocked(execFileSync).mockImplementationOnce(() => {
        throw error;
      });

      await expect(start(options)).rejects.toMatchObject({
        message: ERR_VOICE_OVER_CANNOT_BE_STARTED,
        cause: error,
      });
      expect(waitForReady).not.toHaveBeenCalled();
      expect(activate).not.toHaveBeenCalled();
    });
  });

  describe("when activating VoiceOver fails", () => {
    const error = new Error("activation failed");

    test("should propagate the activation error to the caller", async () => {
      jest.mocked(activate).mockRejectedValueOnce(error);

      await expect(start(options)).rejects.toBe(error);
    });
  });
});
