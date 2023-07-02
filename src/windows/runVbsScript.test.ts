import { ChildProcess, ExecException, execFile } from "child_process";
import { mkdtemp, realpath, rm, writeFile } from "fs/promises";
import { DEFAULT_MAX_BUFFER } from "../constants";
import { runVbsScript } from "./runVbsScript";
import { sep } from "path";
import { tmpdir } from "os";

jest.mock("child_process", () => ({
  execFile: jest.fn(),
}));

jest.mock("fs/promises", () => ({
  mkdtemp: jest.fn(),
  realpath: jest.fn(),
  rm: jest.fn(),
  writeFile: jest.fn(),
}));

const script = "test-script";

const childStub = {
  stdin: {
    end: jest.fn(),
  },
};

const dirStub = "test-dir";
const tmpdirStub = "test-tmpdir";

const mockExecFile = jest.mocked(execFile);
const mockMkdtemp = jest.mocked(mkdtemp);
const mockRealpath = jest.mocked(realpath);
const mockRm = jest.mocked(rm);
const mockWriteFile = jest.mocked(writeFile);

describe("runVbsScript", () => {
  let resultPromise: Promise<string | void>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when called", () => {
    beforeEach(() => {
      mockExecFile.mockReturnValue(childStub as unknown as ChildProcess);
      mockMkdtemp.mockResolvedValue(dirStub);
      mockRealpath.mockResolvedValue(tmpdirStub);

      resultPromise = runVbsScript(script);
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

    it("should get the real path of the tmpdir for the os", () => {
      expect(mockRealpath).toHaveBeenCalledWith(tmpdir());
    });

    it("should create a new temporary directory based on the os tmpdir", () => {
      expect(mockMkdtemp).toHaveBeenCalledWith(tmpdirStub + sep);
    });

    it("should create a vbs file in the temporary directory with the provided script contents", () => {
      expect(mockWriteFile).toHaveBeenCalledWith(
        dirStub + sep + "script.vbs",
        script
      );
    });

    it("should spawn cscript directly as a new process, using a max buffer of 100mb", () => {
      expect(execFile).toHaveBeenCalledWith(
        "cscript",
        [expect.any(String)],
        {
          maxBuffer: DEFAULT_MAX_BUFFER,
        },
        expect.any(Function)
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

        it("should delete the temporary directory", async () => {
          try {
            await resultPromise;
          } catch {
            // swallow
          }

          expect(mockRm).toHaveBeenCalledWith(dirStub, { recursive: true });
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

      it("should delete the temporary directory", async () => {
        await resultPromise;

        expect(mockRm).toHaveBeenCalledWith(dirStub, { recursive: true });
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

      it("should delete the temporary directory", async () => {
        await resultPromise;

        expect(mockRm).toHaveBeenCalledWith(dirStub, { recursive: true });
      });
    });
  });
});
