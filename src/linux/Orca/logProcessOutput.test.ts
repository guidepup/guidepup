import { base } from "../../debug";
import type { ChildProcess } from "node:child_process";
import EventEmitter from "node:events";
import { logProcessOutput } from "./logProcessOutput";

jest.mock("../../debug", () => {
  const debug = jest.fn();

  return { base: { extend: () => debug } };
});

const debug = base.extend("test") as unknown as jest.Mock;

class FakeProcess extends EventEmitter {
  stdout: EventEmitter | null = new EventEmitter();
  stderr = new EventEmitter();
}

describe("logProcessOutput", () => {
  let child: FakeProcess;

  beforeEach(() => {
    jest.clearAllMocks();

    child = new FakeProcess();
  });

  describe("when the process has an stdout", () => {
    beforeEach(() => {
      logProcessOutput(child as unknown as ChildProcess, "test-name");
    });

    it.each(["stdout", "stderr"] as const)(
      "should log its %s without trailing whitespace",
      (stream) => {
        child[stream].emit("data", Buffer.from("test-output\n"));

        expect(debug).toHaveBeenCalledWith("[test-name] test-output");
      },
    );

    it("should log its errors", () => {
      child.emit("error", new Error("test-error"));

      expect(debug).toHaveBeenCalledWith(
        "[test-name] process error: test-error",
      );
    });

    it("should log its exit", () => {
      child.emit("exit", 0, null);

      expect(debug).toHaveBeenCalledWith(
        "[test-name] exited with code=0, signal=null",
      );
    });
  });

  describe("when the process has no stdout", () => {
    beforeEach(() => {
      child.stdout = null;

      logProcessOutput(child as unknown as ChildProcess, "test-name");
    });

    it("should still log its stderr", () => {
      child.stderr.emit("data", Buffer.from("test-output\n"));

      expect(debug).toHaveBeenCalledWith("[test-name] test-output");
    });
  });
});
