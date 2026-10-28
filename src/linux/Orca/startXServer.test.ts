import { execFileSync, spawn } from "node:child_process";
import { ERR_ORCA_X_SERVER_TIMEOUT } from "../errors";
import { findAvailableDisplay } from "./findAvailableDisplay";
import { logProcessOutput } from "./logProcessOutput";
import { startXServer } from "./startXServer";
import { terminateProcess } from "./terminateProcess";

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
  spawn: jest.fn(),
}));
jest.mock("../../debug", () => {
  const debug = jest.fn();

  return { base: { extend: () => debug } };
});
jest.mock("./findAvailableDisplay", () => ({
  findAvailableDisplay: jest.fn(),
}));
jest.mock("./logProcessOutput", () => ({
  logProcessOutput: jest.fn(),
}));
jest.mock("./terminateProcess", () => ({
  terminateProcess: jest.fn(),
}));

const mockDisplay = "test-display";
const xvfbProcessStub = Symbol("test-xvfb-process");

describe("startXServer", () => {
  const originalEnv = process.env;

  /**
   * Starts the X server, flushing the timers of any polling.
   */
  const start = async () => {
    const promise = startXServer();

    promise.catch(() => {});

    await jest.runAllTimersAsync();

    return promise;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({
      doNotFake: ["nextTick", "queueMicrotask", "setImmediate"],
    });

    process.env = { ...originalEnv };
    delete process.env.DISPLAY;

    jest.mocked(spawn).mockReturnValue(xvfbProcessStub as never);
    jest.mocked(execFileSync).mockReturnValue(Buffer.from(""));
    jest.mocked(findAvailableDisplay).mockReturnValue(mockDisplay);
  });

  afterEach(() => {
    process.env = originalEnv;

    jest.useRealTimers();
  });

  describe("when DISPLAY is not set", () => {
    let result: Awaited<ReturnType<typeof startXServer>>;

    beforeEach(async () => {
      result = await start();
    });

    it("should start Xvfb on an available display", () => {
      expect(spawn).toHaveBeenCalledWith("Xvfb", [
        mockDisplay,
        "-screen",
        "0",
        "1280x720x24",
      ]);
    });

    it("should log the output of Xvfb", () => {
      expect(logProcessOutput).toHaveBeenCalledWith(xvfbProcessStub, "xvfb");
    });

    it("should wait for the X server to accept connections", () => {
      expect(execFileSync).toHaveBeenCalledWith("xdpyinfo", [
        "-display",
        mockDisplay,
      ]);
    });

    it("should return the display and the Xvfb process", () => {
      expect(result).toEqual({
        display: mockDisplay,
        process: xvfbProcessStub,
      });
    });
  });

  describe("when DISPLAY is set", () => {
    let result: Awaited<ReturnType<typeof startXServer>>;

    beforeEach(async () => {
      process.env.DISPLAY = "test-existing-display";

      result = await start();
    });

    it("should use the existing X server", () => {
      expect(findAvailableDisplay).not.toHaveBeenCalled();
      expect(spawn).not.toHaveBeenCalled();
      expect(execFileSync).toHaveBeenCalledWith("xdpyinfo", [
        "-display",
        "test-existing-display",
      ]);
    });

    it("should return the display without a process", () => {
      expect(result).toEqual({
        display: "test-existing-display",
        process: null,
      });
    });
  });

  describe("when the X server takes a while to be ready", () => {
    beforeEach(async () => {
      jest.mocked(execFileSync).mockImplementationOnce(() => {
        throw new Error("test-error");
      });

      await start();
    });

    it("should poll until it is ready", () => {
      expect(execFileSync).toHaveBeenCalledTimes(2);
    });
  });

  describe("when the X server never becomes ready", () => {
    beforeEach(() => {
      jest.mocked(execFileSync).mockImplementation(() => {
        throw new Error("test-error");
      });
    });

    it("should stop the Xvfb it started and throw", async () => {
      await expect(start()).rejects.toThrow(ERR_ORCA_X_SERVER_TIMEOUT);

      expect(terminateProcess).toHaveBeenCalledWith(
        xvfbProcessStub,
        "X Server",
      );
    });

    describe("when DISPLAY is set", () => {
      it("should have no process to stop", async () => {
        process.env.DISPLAY = "test-existing-display";

        await expect(start()).rejects.toThrow(ERR_ORCA_X_SERVER_TIMEOUT);

        expect(terminateProcess).toHaveBeenCalledWith(null, "X Server");
      });
    });
  });
});
