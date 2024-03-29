import { ChildProcess, exec } from "child_process";
import { activate } from "../activate";
import { Applications } from "../Applications";
import { isRunning } from "./isRunning";
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (exec as any).mockImplementation((_command, callback) => {
          callback(errorStub, "", "");

          return {} as unknown as ChildProcess;
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (exec as any).mockImplementation((_command, callback) => {
          callback(null, "", "");

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (exec as any).mockImplementation((_command, callback) => {
          callback(null, "test-ps-aux-response-containing-VoiceOver");

          return {} as unknown as ChildProcess;
        });
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

      describe("when called without a skipActivate argument", () => {
        describe("when AppleScript says VoiceOver is running", () => {
          beforeEach(() => {
            jest.mocked(runAppleScript).mockResolvedValue("true");
          });

          describe("when attempting to activate VoiceOver throws an error", () => {
            const errorStub = new Error("test-error");

            beforeEach(async () => {
              jest.mocked(activate).mockRejectedValue(errorStub);

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
              jest.mocked(activate).mockResolvedValue();

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

      describe("when called with skipActivate set to false", () => {
        describe("when AppleScript says VoiceOver is running", () => {
          beforeEach(() => {
            jest.mocked(runAppleScript).mockResolvedValue("true");
          });

          describe("when attempting to activate VoiceOver throws an error", () => {
            const errorStub = new Error("test-error");

            beforeEach(async () => {
              jest.mocked(activate).mockRejectedValue(errorStub);

              result = await isRunning(options, false);
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
              jest.mocked(activate).mockResolvedValue();

              result = await isRunning(options, false);
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

      describe("when called with skipActivate set to true", () => {
        describe("when AppleScript says VoiceOver is running", () => {
          beforeEach(async () => {
            jest.mocked(runAppleScript).mockResolvedValue("true");

            result = await isRunning(options, true);
          });

          commonProcessAssertions();
          commonAppleScriptRunningAssertions();

          it("should not try to activate VoiceOver", () => {
            expect(activate).not.toHaveBeenCalled();
          });

          it("should return true", () => {
            expect(result).toBe(true);
          });
        });
      });
    });
  });
});
