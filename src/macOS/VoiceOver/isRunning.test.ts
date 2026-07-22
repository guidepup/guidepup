import { Applications } from "../Applications";
import { execFileSync } from "child_process";
import { isRunning } from "./isRunning";
import { runAppleScript } from "../runAppleScript";

jest.mock("child_process", () => ({
  execFileSync: jest.fn(),
}));
jest.mock("../runAppleScript", () => ({
  runAppleScript: jest.fn(),
}));

describe("when calling isRunning", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each`
    description          | options
    ${"without options"} | ${undefined}
    ${"with options"}    | ${{}}
  `("when called $description", ({ options }) => {
    let result: unknown;

    const commonProcessAssertions = () => {
      it("should check whether the VoiceOver process is running", () => {
        expect(execFileSync).toHaveBeenCalledWith(
          "pgrep",
          ["-f", "VoiceOver launchd -s"],
          { encoding: "utf8", timeout: 2000 },
        );
      });
    };

    const commonAppleScriptRunningAssertions = () => {
      it("should check whether the application is running via AppleScript", () => {
        expect(runAppleScript).toHaveBeenCalledWith(
          `tell application "${Applications.VoiceOver}"\nreturn running\nend tell`,
          options,
        );
      });
    };

    describe("when checking whether the process is running throws an error", () => {
      beforeEach(async () => {
        jest.mocked(execFileSync).mockImplementation(() => {
          throw new Error("test-error");
        });

        result = await isRunning(options);
      });

      commonProcessAssertions();

      it("should return false", () => {
        expect(result).toBe(false);
      });
    });

    describe("when the process is not running", () => {
      beforeEach(async () => {
        jest.mocked(execFileSync).mockReturnValue("");

        result = await isRunning(options);
      });

      commonProcessAssertions();

      it("should return false", () => {
        expect(result).toBe(false);
      });
    });

    describe("when the process is running", () => {
      beforeEach(() => {
        jest.mocked(execFileSync).mockReturnValue("123\n");
      });

      describe("when AppleScript says VoiceOver isn't running", () => {
        beforeEach(async () => {
          jest.mocked(runAppleScript).mockResolvedValue("false");

          result = await isRunning(options);
        });

        commonProcessAssertions();
        commonAppleScriptRunningAssertions();

        it("should return false", () => {
          expect(result).toBe(false);
        });
      });

      describe("when called without a skipAppleScript argument", () => {
        describe("when AppleScript says VoiceOver is running", () => {
          beforeEach(async () => {
            jest.mocked(runAppleScript).mockResolvedValue("true");

            result = await isRunning(options);
          });

          commonProcessAssertions();
          commonAppleScriptRunningAssertions();

          it("should return true", () => {
            expect(result).toBe(true);
          });
        });
      });

      describe("when called with skipAppleScript set to false", () => {
        describe("when AppleScript says VoiceOver is running", () => {
          beforeEach(async () => {
            jest.mocked(runAppleScript).mockResolvedValue("true");

            result = await isRunning(options, false);
          });

          commonProcessAssertions();
          commonAppleScriptRunningAssertions();

          it("should return true", () => {
            expect(result).toBe(true);
          });
        });
      });

      describe("when called with skipAppleScript set to true", () => {
        beforeEach(async () => {
          result = await isRunning(options, true);
        });

        commonProcessAssertions();

        it("should not check VoiceOver via AppleScript", () => {
          expect(runAppleScript).not.toHaveBeenCalled();
        });

        it("should return true", () => {
          expect(result).toBe(true);
        });
      });
    });
  });
});
