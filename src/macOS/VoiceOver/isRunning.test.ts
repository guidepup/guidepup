import { Applications } from "../Applications";
import { execFileSync } from "child_process";
import { isRunning } from "./isRunning";
import { once } from "events";
import { runAppleScript } from "../runAppleScript";

jest.mock("child_process", () => ({
  execFileSync: jest.fn(),
}));
jest.mock("../runAppleScript", () => ({
  runAppleScript: jest.fn(),
}));

describe("when calling isRunning", () => {
  const describeRealProcessDetection =
    process.platform === "darwin" ? describe : describe.skip;

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
          ["-x", "VoiceOver"],
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

  describeRealProcessDetection("when using the real process matcher", () => {
    it("should ignore processes whose arguments contain the VoiceOver launch command", async () => {
      const actualChildProcess = jest.requireActual<
        typeof import("child_process")
      >("child_process");
      const actualExecFileSync = actualChildProcess.execFileSync;
      const decoy = actualChildProcess.spawn(
        process.execPath,
        ["-e", "setInterval(() => {}, 1000)", "VoiceOver launchd -s"],
        { stdio: "ignore" },
      );
      let namedProcess: ReturnType<typeof actualChildProcess.spawn> | undefined;

      jest.mocked(execFileSync).mockImplementation((file, args, options) =>
        actualExecFileSync(
          file,
          ["-P", String(process.pid), ...(args ?? [])],
          options,
        ),
      );

      try {
        await once(decoy, "spawn");

        expect(await isRunning(undefined, true)).toBe(false);

        namedProcess = actualChildProcess.spawn("/bin/sleep", ["10"], {
          argv0: "VoiceOver",
          stdio: "ignore",
        });
        await once(namedProcess, "spawn");

        expect(await isRunning(undefined, true)).toBe(true);
      } finally {
        for (const child of [namedProcess, decoy]) {
          if (child && child.exitCode === null) {
            const exited = once(child, "exit");
            child.kill("SIGTERM");
            await exited;
          }
        }

        jest.mocked(execFileSync).mockReset();
      }
    });
  });
});
