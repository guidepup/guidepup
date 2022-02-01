import { disableSplashScreen } from "./disableSplashScreen";
import { ERR_VOICE_OVER_UNABLE_TO_DISABLE_SPLASH } from "../errors";
import { exec } from "child_process";
import { mockType } from "../../../test/mockType";

jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

describe("disableSplashScreen", () => {
  let resultPromise;

  beforeEach(() => {
    jest.clearAllMocks();

    resultPromise = disableSplashScreen();
  });

  afterEach(async () => {
    mockType(exec).mock.calls[0][1]();

    try {
      await resultPromise;
    } catch {
      // swallow
    }
  });

  it("should execute a command to update the VoiceOver training defaults to not show the splash screen", () => {
    expect(exec).toHaveBeenCalledWith(
      "defaults write com.apple.VoiceOverTraining doNotShowSplashScreen -bool true",
      expect.any(Function)
    );
  });

  describe("when the command succeeds", () => {
    beforeEach(() => {
      mockType(exec).mock.calls[0][1]();
    });

    it("should resolve", async () => {
      await expect(resultPromise).resolves.toBeUndefined();
    });
  });

  describe("when the command fails", () => {
    const errorStub = new Error("test-error-message");

    beforeEach(() => {
      mockType(exec).mock.calls[0][1](errorStub);
    });

    it("should reject with an error", async () => {
      await expect(resultPromise).rejects.toEqual(
        new Error(
          `${ERR_VOICE_OVER_UNABLE_TO_DISABLE_SPLASH}\n${errorStub.message}`
        )
      );
    });
  });
});
