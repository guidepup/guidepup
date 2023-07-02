import { ChildProcess, ExecException, execFile } from "child_process";
import { DEFAULT_MAX_BUFFER, DEFAULT_TIMEOUT } from "../constants";
import { runAppleScript } from "./runAppleScript";

jest.mock("child_process", () => ({
  execFile: jest.fn(),
}));

const script = "test-script";
const timeout = 123456;

const childStub = {
  stdin: {
    write: jest.fn(),
    end: jest.fn(),
  },
};

const mockExecFile = jest.mocked(execFile);

describe("runAppleScript", () => {
  let resultPromise: Promise<string | void>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each`
    description                  | options        | expectedTimeout
    ${"without options"}         | ${undefined}   | ${DEFAULT_TIMEOUT}
    ${"with no timeout options"} | ${{}}          | ${DEFAULT_TIMEOUT}
    ${"with timeout options"}    | ${{ timeout }} | ${timeout}
  `("when called $description", ({ options, expectedTimeout }) => {
    beforeEach(() => {
      mockExecFile.mockReturnValue(childStub as unknown as ChildProcess);

      resultPromise = runAppleScript(script, options);
    });

    afterEach(async () => {
      (
        mockExecFile.mock.calls[0][3] as (
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

    it("should spawn osascript directly as a new process, using a max buffer of 100mb", () => {
      expect(execFile).toHaveBeenCalledWith(
        "/usr/bin/osascript",
        [],
        {
          maxBuffer: DEFAULT_MAX_BUFFER,
        },
        expect.any(Function)
      );
    });

    it("should add a timeout block to the script and pass it to the osascript process stdin", () => {
      expect(childStub.stdin.write).toHaveBeenCalledWith(
        `with timeout of ${expectedTimeout} seconds\n${script}\nend timeout`
      );
    });

    it("should end the stdin", () => {
      expect(childStub.stdin.end).toHaveBeenCalled();
    });

    describe("when the script completes", () => {
      describe("and it errored", () => {
        const error = new Error("test-error");

        beforeEach(() => {
          (
            mockExecFile.mock.calls[0][3] as (
              error: ExecException | null,
              stdout: string,
              stderr: string
            ) => void
          )(error, "", "");
        });

        it("should reject with the error", async () => {
          await expect(resultPromise).rejects.toEqual(error);
        });
      });
    });

    describe("and it outputted a value", () => {
      const stdout = "test-stdout";

      beforeEach(() => {
        (
          mockExecFile.mock.calls[0][3] as (
            error: ExecException | null,
            stdout: string,
            stderr: string
          ) => void
        )(null, `\n ${stdout} \t\n  `, "");
      });

      it("should resolve with the whitespace trimmed output", async () => {
        await expect(resultPromise).resolves.toEqual(stdout);
      });
    });

    describe("and it didn't output a value", () => {
      beforeEach(() => {
        (
          mockExecFile.mock.calls[0][3] as (
            error: ExecException | null,
            stdout: string,
            stderr: string
          ) => void
        )(null, "", "");
      });

      it("should resolve with no value", async () => {
        await expect(resultPromise).resolves.toEqual(undefined);
      });
    });
  });
});
