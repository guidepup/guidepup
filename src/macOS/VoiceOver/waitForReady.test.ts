import {
  DEFAULT_RUNNING_TIMEOUT,
  ERR_APPLE_SCRIPT_APPLICATION_NOT_RUNNING,
  ERR_APPLE_SCRIPT_TIMED_OUT,
} from "../../constants";
import { ERR_VOICE_OVER_RUNNING_TIMEOUT } from "../errors";
import { isRunning } from "./isRunning";
import { runAppleScript } from "../runAppleScript";
import { waitForCondition } from "../../waitForCondition";
import { waitForReady } from "./waitForReady";

jest.mock("./isRunning", () => ({
  isRunning: jest.fn(),
}));
jest.mock("../runAppleScript", () => ({
  runAppleScript: jest.fn(),
}));
jest.mock("../../waitForCondition", () => ({
  waitForCondition: jest.fn(),
}));

const options = { timeout: 1234 };

describe("waitForReady", () => {
  let isReady: () => Promise<boolean>;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.mocked(isRunning).mockResolvedValue(true);

    await waitForReady(options);

    isReady = jest.mocked(waitForCondition).mock
      .calls[0][0] as () => Promise<boolean>;
  });

  it("should wait for VoiceOver to be ready for up to the running timeout", () => {
    expect(waitForCondition).toHaveBeenCalledWith(expect.any(Function), {
      pollTimeout: DEFAULT_RUNNING_TIMEOUT,
      timeoutErrorMessage: ERR_VOICE_OVER_RUNNING_TIMEOUT,
    });
  });

  describe("when the VoiceOver process doesn't exist yet", () => {
    beforeEach(() => {
      jest.mocked(isRunning).mockResolvedValue(false);
    });

    it("should not be ready, without sending VoiceOver an event", async () => {
      await expect(isReady()).resolves.toBe(false);
      expect(isRunning).toHaveBeenCalledWith(options, true);
      expect(runAppleScript).not.toHaveBeenCalled();
    });
  });

  describe("when VoiceOver answers", () => {
    beforeEach(() => {
      jest.mocked(runAppleScript).mockResolvedValue("true");
    });

    it("should be ready", async () => {
      await expect(isReady()).resolves.toBe(true);
    });

    it("should send VoiceOver a lightweight event", async () => {
      await isReady();

      expect(runAppleScript).toHaveBeenCalledWith(
        `tell application "VoiceOver"\nreturn enabled of caption window\nend tell`,
        { timeout: 1000 },
      );
    });
  });

  describe.each`
    description                                     | message                                                                                      | expected
    ${"an error from VoiceOver about the property"} | ${"execution error: VoiceOver got an error: Can’t get enabled. (-1728)"}                     | ${true}
    ${"VoiceOver not being registered yet"}         | ${`execution error: Application isn’t running. ${ERR_APPLE_SCRIPT_APPLICATION_NOT_RUNNING}`} | ${false}
    ${"an AppleEvent timeout"}                      | ${`execution error: AppleEvent timed out. ${ERR_APPLE_SCRIPT_TIMED_OUT}`}                    | ${false}
  `("when the event fails with $description", ({ message, expected }) => {
    beforeEach(() => {
      jest.mocked(runAppleScript).mockRejectedValue(new Error(message));
    });

    it(`should ${expected ? "" : "not "}be ready`, async () => {
      await expect(isReady()).resolves.toBe(expected);
    });
  });
});
