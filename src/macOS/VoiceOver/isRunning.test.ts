import { ChildProcess, exec } from "child_process";
import { activate } from "../activate";
import { Applications } from "../Applications";
import { isRunning } from "./isRunning";
import { mockType } from "../../../test/mockType";
import { runAppleScript } from "../runAppleScript";

jest.mock("child_process", () => ({
  exec: jest.fn(),
}));
jest.mock("../activate", () => ({
  activate: jest.fn(),
}));
jest.mock("../runAppleScript", () => ({
  runAppleScript: jest.fn(),
}));

describe("isRunning", () => {
  describe.each`
    description          | options
    ${"without options"} | ${undefined}
    ${"with options"}    | ${{}}
  `("when called $description", ({ options }) => {
    let result;

    const commonProcessAssertions = () => {
      it("should check to see if the process is running", () => {
        expect(exec).toHaveBeenCalledWith(
          'ps aux | egrep "[V]oiceOver"',
          expect.any(Function)
        );
      });
    };

    const commonAppleScriptRunningAssertions = () => {
      it("should check to see if the application is running via AppleScript", () => {
        expect(runAppleScript).toHaveBeenCalledWith(
          `tell application "${Applications.VoiceOver}"\nreturn running\nend tell`
        );
      });
    };

    const commonActivateAssertions = () => {
      it("should try to activate VoiceOver", () => {
        expect(activate).toHaveBeenCalledWith(Applications.VoiceOver, options);
      });
    };

    describe("when checking if process is running throws an error", () => {
      const errorStub = new Error("test-error");

      beforeEach(async () => {
        mockType(exec).mockImplementation((_command, callback) => {
          callback(errorStub, "");

          return {} as unknown as ChildProcess;
        });

        try {
          await isRunning(options);
        } catch (error) {
          result = error;
        }
      });

      commonProcessAssertions();

      it("should throw an error", () => {
        expect(result).toBe(errorStub);
      });
    });

    describe("when the process is not running", () => {
      beforeEach(async () => {
        mockType(exec).mockImplementation((_command, callback) => {
          callback(null, "");

          return {} as unknown as ChildProcess;
        });

        result = await isRunning(options);
      });

      commonProcessAssertions();

      it("should return false", () => {
        expect(result).toBe(false);
      });
    });

    describe("when the process is running", () => {
      beforeEach(() => {
        mockType(exec).mockImplementation((_command, callback) => {
          callback(null, "test-ps-aux-response-containing-VoiceOver");

          return {} as unknown as ChildProcess;
        });
      });

      describe("when AppleScript says VoiceOver isn't running", () => {
        beforeEach(async () => {
          mockType(runAppleScript).mockResolvedValue("false");

          result = await isRunning(options);
        });

        commonProcessAssertions();
        commonAppleScriptRunningAssertions();

        it("should return false", () => {
          expect(result).toBe(false);
        });
      });

      describe("when AppleScript says VoiceOver is running", () => {
        beforeEach(() => {
          mockType(runAppleScript).mockResolvedValue("true");
        });

        describe("when attempting to activate VoiceOver throws an error", () => {
          const errorStub = new Error("test-error");

          beforeEach(async () => {
            mockType(activate).mockRejectedValue(errorStub);

            result = await isRunning(options);
          });

          commonProcessAssertions();
          commonAppleScriptRunningAssertions();
          commonActivateAssertions();

          it("should return false", () => {
            expect(result).toBe(false);
          });
        });

        describe("when attempting to activate VoiceOver is successful", () => {
          beforeEach(async () => {
            mockType(activate).mockResolvedValue();

            result = await isRunning(options);
          });

          commonProcessAssertions();
          commonAppleScriptRunningAssertions();
          commonActivateAssertions();

          it("should return true", () => {
            expect(result).toBe(true);
          });
        });
      });
    });
  });
});
