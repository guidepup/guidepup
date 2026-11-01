import { DEFAULT_RUNNING_TIMEOUT } from "../../constants";
import { ERR_VOICE_OVER_RUNNING_TIMEOUT } from "../errors";
import { isRunning } from "./isRunning";
import { requestStart } from "./start";
import { startUserVoiceOver } from "./startUserVoiceOver";
import { waitForCondition } from "../../waitForCondition";

jest.mock("./isRunning", () => ({
  isRunning: jest.fn(),
}));
jest.mock("./start", () => ({
  requestStart: jest.fn(),
}));
jest.mock("../../waitForCondition", () => ({
  waitForCondition: jest.fn(),
}));

const mockError = new Error("test-error");

describe("startUserVoiceOver", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(waitForCondition).mockResolvedValue();
  });

  describe("when VoiceOver starts", () => {
    beforeEach(async () => {
      await startUserVoiceOver();
    });

    it("should ask VoiceOver to start", () => {
      expect(requestStart).toHaveBeenCalled();
    });

    it("should wait until the VoiceOver process is running, without waiting for AppleScript", async () => {
      expect(waitForCondition).toHaveBeenCalledWith(expect.any(Function), {
        pollTimeout: DEFAULT_RUNNING_TIMEOUT,
        timeoutErrorMessage: ERR_VOICE_OVER_RUNNING_TIMEOUT,
      });

      const [condition] = jest.mocked(waitForCondition).mock.calls[0];
      const runningDummy = Symbol("test-running") as unknown as boolean;

      jest.mocked(isRunning).mockResolvedValue(runningDummy);

      await expect(condition()).resolves.toBe(runningDummy);
      expect(isRunning).toHaveBeenCalledWith(undefined, true);
    });
  });

  describe("when asking VoiceOver to start fails", () => {
    it("should throw the error without waiting", async () => {
      jest.mocked(requestStart).mockImplementationOnce(() => {
        throw mockError;
      });

      await expect(startUserVoiceOver()).rejects.toBe(mockError);
      expect(waitForCondition).not.toHaveBeenCalled();
    });
  });

  describe("when VoiceOver does not start in time", () => {
    it("should throw the error", async () => {
      jest.mocked(waitForCondition).mockRejectedValueOnce(mockError);

      await expect(startUserVoiceOver()).rejects.toBe(mockError);
    });
  });
});
