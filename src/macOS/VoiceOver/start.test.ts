import { exec, ExecException } from "child_process";
import { ERR_VOICE_OVER_CANNOT_BE_STARTED } from "../errors";
import { start } from "./start";

jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

describe("start", () => {
  let resultPromise;

  beforeEach(() => {
    jest.clearAllMocks();

    resultPromise = start();
  });

  afterEach(async () => {
    (
      jest.mocked(exec).mock.calls[0][1] as (
        error: ExecException | null,
        stdout: string,
        stderr: string
      ) => void
    )(null, "", "");

    try {
      await resultPromise;
    } catch {
      // swallow
    }
  });

  it("should execute a command to start VoiceOver", () => {
    expect(exec).toHaveBeenCalledWith(
      "/System/Library/CoreServices/VoiceOver.app/Contents/MacOS/VoiceOverStarter",
      expect.any(Function)
    );
  });

  describe("when the command succeeds", () => {
    beforeEach(() => {
      (
        jest.mocked(exec).mock.calls[0][1] as (
          error: ExecException | null,
          stdout: string,
          stderr: string
        ) => void
      )(null, "", "");
    });

    it("should resolve", async () => {
      await expect(resultPromise).resolves.toBeUndefined();
    });
  });

  describe("when the command fails", () => {
    const errorStub = new Error("test-error-message");

    beforeEach(() => {
      (
        jest.mocked(exec).mock.calls[0][1] as (
          error: ExecException | null,
          stdout: string,
          stderr: string
        ) => void
      )(errorStub, "", "");
    });

    it("should reject with an error", async () => {
      await expect(resultPromise).rejects.toEqual(
        new Error(`${ERR_VOICE_OVER_CANNOT_BE_STARTED}\n${errorStub.message}`)
      );
    });
  });
});
