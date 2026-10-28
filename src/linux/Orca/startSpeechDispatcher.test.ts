import { base } from "../../debug";
import { ERR_ORCA_SPEECH_DISPATCHER_SERVICE_TIMEOUT } from "../errors";
import { getOrcaInstallationPath } from "./getOrcaInstallationPath";
import { isUnixSocket } from "./isUnixSocket";
import { join } from "node:path";
import { logProcessOutput } from "./logProcessOutput";
import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { startSpeechDispatcher } from "./startSpeechDispatcher";
import { terminateProcess } from "./terminateProcess";

jest.mock("node:child_process", () => ({
  spawn: jest.fn(),
}));
jest.mock("node:fs", () => ({
  mkdirSync: jest.fn(),
}));
jest.mock("../../debug", () => {
  const debug = Object.assign(jest.fn(), { enabled: false });

  return { base: { extend: () => debug } };
});
jest.mock("./getOrcaInstallationPath", () => ({
  getOrcaInstallationPath: jest.fn(),
}));
jest.mock("./isUnixSocket", () => ({
  isUnixSocket: jest.fn(),
}));
jest.mock("./logProcessOutput", () => ({
  logProcessOutput: jest.fn(),
}));
jest.mock("./terminateProcess", () => ({
  terminateProcess: jest.fn(),
}));

const debug = base.extend("test") as unknown as jest.Mock & {
  enabled: boolean;
};

const mockInstallationPath = "test-installation-path";
const mockRuntimeDirectory = "test-runtime-directory";
const mockSpeechdSocketPath = join(mockRuntimeDirectory, "speechd.sock");
const mockGuidepupSocketPath = join(mockRuntimeDirectory, "guidepup.sock");
const speechdProcessStub = Symbol("test-speechd-process");

describe("startSpeechDispatcher", () => {
  /**
   * Starts Speech Dispatcher, flushing the timers of any polling.
   */
  const start = async () => {
    const promise = startSpeechDispatcher(mockRuntimeDirectory);

    promise.catch(() => {});

    await jest.runAllTimersAsync();

    return promise;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({
      doNotFake: ["nextTick", "queueMicrotask", "setImmediate"],
    });

    debug.enabled = false;

    jest.mocked(spawn).mockReturnValue(speechdProcessStub as never);
    jest.mocked(getOrcaInstallationPath).mockReturnValue(mockInstallationPath);
    jest.mocked(isUnixSocket).mockReturnValue(true);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("when its socket appears", () => {
    let result: Awaited<ReturnType<typeof startSpeechDispatcher>>;

    beforeEach(async () => {
      result = await start();
    });

    it("should create its log directory", () => {
      expect(mkdirSync).toHaveBeenCalledWith(
        join(mockInstallationPath, "speechd", "logs"),
        { recursive: true },
      );
    });

    it("should start Speech Dispatcher with SIGPIPE ignored and the session sockets", () => {
      expect(spawn).toHaveBeenCalledWith(
        "env",
        [
          "--ignore-signal=PIPE",
          "speech-dispatcher",
          "--run-single",
          "--config-dir",
          join(mockInstallationPath, "speechd"),
          "--module-dir",
          join(mockInstallationPath, "speechd", "modules"),
          "--log-dir",
          join(mockInstallationPath, "speechd", "logs"),
          "--communication-method",
          "unix_socket",
          "--socket-path",
          mockSpeechdSocketPath,
          "--timeout",
          "0",
        ],
        {
          env: expect.objectContaining({
            GUIDEPUP_ORCA_SPEECH_SOCKET: mockGuidepupSocketPath,
          }),
          stdio: ["ignore", "pipe", "pipe"],
        },
      );
    });

    it("should log the output of Speech Dispatcher", () => {
      expect(logProcessOutput).toHaveBeenCalledWith(
        speechdProcessStub,
        "speechd",
      );
    });

    it("should wait for its socket", () => {
      expect(isUnixSocket).toHaveBeenCalledWith(mockSpeechdSocketPath);
    });

    it("should return its address, the guidepup socket and the process", () => {
      expect(result).toEqual({
        address: `unix_socket:${mockSpeechdSocketPath}`,
        guidepupSocketPath: mockGuidepupSocketPath,
        process: speechdProcessStub,
      });
    });
  });

  describe("when debug logging is enabled", () => {
    beforeEach(async () => {
      debug.enabled = true;

      await start();
    });

    it("should start Speech Dispatcher with verbose logging", () => {
      expect(spawn).toHaveBeenCalledWith(
        "env",
        expect.arrayContaining(["--log-level", "5"]),
        expect.anything(),
      );
    });
  });

  describe("when its socket takes a while to appear", () => {
    beforeEach(async () => {
      jest
        .mocked(isUnixSocket)
        .mockImplementationOnce(() => {
          throw new Error("test-error");
        })
        .mockReturnValueOnce(false);

      await start();
    });

    it("should poll until it appears", () => {
      expect(isUnixSocket).toHaveBeenCalledTimes(3);
    });
  });

  describe("when its socket never appears", () => {
    it("should stop Speech Dispatcher and throw", async () => {
      jest.mocked(isUnixSocket).mockReturnValue(false);

      await expect(start()).rejects.toThrow(
        ERR_ORCA_SPEECH_DISPATCHER_SERVICE_TIMEOUT,
      );

      expect(terminateProcess).toHaveBeenCalledWith(
        speechdProcessStub,
        "Speech Dispatcher",
      );
    });
  });
});
