import type { ChildProcess } from "node:child_process";
import EventEmitter from "node:events";
import { terminateProcess } from "./terminateProcess";

jest.mock("../../debug", () => {
  const debug = jest.fn();

  return { base: { extend: () => debug } };
});

class FakeProcess extends EventEmitter {
  exitCode: number | null = null;
  signalCode: NodeJS.Signals | null = null;

  exit(signal: NodeJS.Signals) {
    this.signalCode = signal;
    this.emit("exit", null, signal);
  }

  kill = jest.fn((signal: NodeJS.Signals) => {
    process.nextTick(() => this.exit(signal));

    return true;
  });
}

describe("terminateProcess", () => {
  let child: FakeProcess;

  const terminate = () =>
    terminateProcess(child as unknown as ChildProcess, "test-name");

  beforeEach(() => {
    jest.useFakeTimers({
      doNotFake: ["nextTick", "queueMicrotask", "setImmediate"],
    });

    child = new FakeProcess();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("when there is no process", () => {
    it("should do nothing", async () => {
      await expect(
        terminateProcess(null, "test-name"),
      ).resolves.toBeUndefined();
    });
  });

  describe("when the process has already exited", () => {
    it.each`
      exitCode | signalCode
      ${0}     | ${null}
      ${null}  | ${"SIGSEGV"}
    `(
      "should not signal it (exitCode=$exitCode, signalCode=$signalCode)",
      async ({ exitCode, signalCode }) => {
        child.exitCode = exitCode;
        child.signalCode = signalCode;

        await terminate();

        expect(child.kill).not.toHaveBeenCalled();
      },
    );
  });

  describe("when the process exits on SIGTERM", () => {
    beforeEach(async () => {
      await terminate();
    });

    it("should send it SIGTERM", () => {
      expect(child.kill).toHaveBeenCalledWith("SIGTERM");
    });

    it("should not send it SIGKILL", () => {
      expect(child.kill).not.toHaveBeenCalledWith("SIGKILL");
    });

    it("should stop listening for its exit", () => {
      expect(child.listenerCount("exit")).toBe(0);
    });
  });

  describe("when the process ignores SIGTERM", () => {
    let terminatePromise: Promise<void>;

    beforeEach(() => {
      child.kill.mockImplementation((signal: NodeJS.Signals) => {
        if (signal === "SIGKILL") {
          process.nextTick(() => child.exit(signal));
        }

        return true;
      });

      terminatePromise = terminate();
    });

    it("should SIGKILL it after 5 seconds", async () => {
      await jest.advanceTimersByTimeAsync(4_999);

      expect(child.kill).not.toHaveBeenCalledWith("SIGKILL");

      await jest.advanceTimersByTimeAsync(1);

      expect(child.kill).toHaveBeenCalledWith("SIGKILL");

      await expect(terminatePromise).resolves.toBeUndefined();
    });
  });

  describe("when the process exits on SIGKILL without an exit event", () => {
    it("should resolve", async () => {
      child.kill.mockImplementation((signal: NodeJS.Signals) => {
        if (signal === "SIGKILL") {
          child.signalCode = signal;
        }

        return true;
      });

      const terminatePromise = terminate();

      await jest.advanceTimersByTimeAsync(10_000);

      await expect(terminatePromise).resolves.toBeUndefined();
    });
  });

  describe("when the process survives SIGKILL", () => {
    let terminatePromise: Promise<void>;

    beforeEach(() => {
      child.kill.mockReturnValue(false);

      terminatePromise = terminate();
      terminatePromise.catch(() => {});
    });

    it("should reject after 10 seconds", async () => {
      await jest.advanceTimersByTimeAsync(10_000);

      await expect(terminatePromise).rejects.toThrow(
        "Failed to terminate test-name process within 10000ms",
      );
    });

    it("should stop listening for its exit", async () => {
      await jest.advanceTimersByTimeAsync(10_000);
      await terminatePromise.catch(() => {});

      expect(child.listenerCount("exit")).toBe(0);
    });
  });

  describe("when signalling the process throws", () => {
    it("should reject with the error", async () => {
      const stubError = new Error("test-error");

      child.kill.mockImplementation(() => {
        throw stubError;
      });

      await expect(terminate()).rejects.toBe(stubError);
    });
  });
});
