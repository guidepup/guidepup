import { Applications } from "../Applications";
import { execFileSync } from "child_process";
import { isRunning } from "./isRunning";
import { keyCodeCommands } from "./keyCodeCommands";
import { runAppleScript } from "../runAppleScript";
import { sendKeys } from "../sendKeys";
import { terminateVoiceOverProcess } from "./terminateVoiceOverProcess";
import { waitForCondition } from "../../waitForCondition";

jest.mock("child_process", () => ({
  execFileSync: jest.fn(),
}));

jest.mock("./isRunning", () => ({
  isRunning: jest.fn(),
}));

jest.mock("../runAppleScript", () => ({
  runAppleScript: jest.fn(),
}));

jest.mock("../sendKeys", () => ({
  sendKeys: jest.fn(),
}));

jest.mock("../../waitForCondition", () => ({
  waitForCondition: jest.fn(),
}));

const optionsDummy = {};

describe("terminateVoiceOverProcess", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    jest.mocked(waitForCondition).mockImplementation(async (condition) => {
      if (!(await condition())) {
        throw new Error("test-timeout");
      }
    });
  });

  describe("when VoiceOver is not running", () => {
    beforeEach(async () => {
      jest.mocked(isRunning).mockResolvedValue(false);

      await terminateVoiceOverProcess(optionsDummy);
    });

    it("should check whether the VoiceOver process is running", () => {
      expect(isRunning).toHaveBeenCalledWith(optionsDummy, true);
    });

    it("should not attempt any termination which could launch or toggle VoiceOver", () => {
      expect(runAppleScript).not.toHaveBeenCalled();
      expect(execFileSync).not.toHaveBeenCalled();
      expect(sendKeys).not.toHaveBeenCalled();
    });
  });

  describe("when VoiceOver is running", () => {
    beforeEach(() => {
      jest.mocked(isRunning).mockResolvedValue(true);
    });

    describe("when the AppleScript based quit stops VoiceOver", () => {
      beforeEach(async () => {
        jest
          .mocked(isRunning)
          .mockResolvedValueOnce(true)
          .mockResolvedValueOnce(false);

        await terminateVoiceOverProcess(optionsDummy);
      });

      it("should attempt an AppleScript based quit of the VoiceOver application without a transaction", () => {
        expect(runAppleScript).toHaveBeenCalledWith(
          `tell application "${Applications.VoiceOver}"\nquit\nend tell`,
          optionsDummy,
        );
      });

      it("should not attempt any further termination", () => {
        expect(execFileSync).not.toHaveBeenCalled();
        expect(sendKeys).not.toHaveBeenCalled();
      });
    });

    describe("when the AppleScript based quit does not stop VoiceOver", () => {
      describe("when the pkill based quit stops VoiceOver", () => {
        beforeEach(async () => {
          jest
            .mocked(isRunning)
            .mockResolvedValueOnce(true)
            .mockResolvedValueOnce(true)
            .mockResolvedValueOnce(false);

          await terminateVoiceOverProcess(optionsDummy);
        });

        it("should attempt to terminate (pkill -15) the VoiceOver process (SIGTERM over SIGKILL owing to the process being run by launchd)", () => {
          expect(execFileSync).toHaveBeenCalledWith(
            "pkill",
            ["-15", "-f", "VoiceOver.app/Contents/MacOS/VoiceOver launchd -s"],
            {
              stdio: "ignore",
              timeout: 2000,
            },
          );
        });

        it("should not attempt the quit key code command", () => {
          expect(sendKeys).not.toHaveBeenCalled();
        });
      });

      describe("when the pkill based quit does not stop VoiceOver", () => {
        beforeEach(async () => {
          await terminateVoiceOverProcess(optionsDummy);
        });

        it("should attempt a quit key code command as a last resort", () => {
          expect(sendKeys).toHaveBeenCalledWith(
            keyCodeCommands.quit,
            undefined,
            optionsDummy,
          );
        });
      });
    });

    describe("when every termination attempt rejects", () => {
      beforeEach(() => {
        jest.mocked(runAppleScript).mockRejectedValue(new Error("test-error"));
        jest.mocked(execFileSync).mockImplementation(() => {
          throw new Error("test-error");
        });
        jest.mocked(sendKeys).mockRejectedValue(new Error("test-error"));
      });

      it("should gracefully handle the failures", async () => {
        await expect(
          terminateVoiceOverProcess(optionsDummy),
        ).resolves.toBeUndefined();

        expect(runAppleScript).toHaveBeenCalled();
        expect(execFileSync).toHaveBeenCalled();
        expect(sendKeys).toHaveBeenCalled();
      });
    });
  });
});
