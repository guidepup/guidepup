import { base } from "../../debug";
import { ERR_ORCA_SERVICE_TIMEOUT } from "../errors";
import EventEmitter from "node:events";
import { getOrcaInstallationPath } from "./getOrcaInstallationPath";
import { join } from "node:path";
import { logProcessOutput } from "./logProcessOutput";
import type { SessionDBus } from "./startSessionDBus";
import { spawn } from "node:child_process";
import { startOrca } from "./startOrca";
import { terminateProcess } from "./terminateProcess";
import { writeFileSync } from "node:fs";

jest.mock("node:child_process", () => ({
  spawn: jest.fn(),
}));
jest.mock("node:fs", () => ({
  writeFileSync: jest.fn(),
}));
jest.mock("../../debug", () => {
  const debug = Object.assign(jest.fn(), { enabled: false });

  return { base: { extend: () => debug } };
});
jest.mock("./getOrcaInstallationPath", () => ({
  getOrcaInstallationPath: jest.fn(),
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

const ORCA_SERVICE = "org.gnome.Orca1.Service";
const mockDisplay = "test-display";
const mockDBusAddress = "test-dbus-address";
const mockInstallationPath = "test-installation-path";
const mockRuntimeDirectory = "test-runtime-directory";
const mockSpeechdAddress = "test-speechd-address";
const mockOrcaExecutable = join(mockInstallationPath, "bin", "orca");
const mockDebugLogPath = join(mockRuntimeDirectory, "orca-debug.log");

describe("startOrca", () => {
  let processes: Record<string, EventEmitter>;
  let busStub: { nameHasOwner: jest.Mock };

  /**
   * Starts Orca, flushing the timers of any polling.
   */
  const start = async () => {
    const promise = startOrca({
      display: mockDisplay,
      runtimeDirectory: mockRuntimeDirectory,
      sessionDBus: {
        address: mockDBusAddress,
        bus: busStub,
        process: null,
      } as unknown as SessionDBus,
      speechdAddress: mockSpeechdAddress,
    });

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
    processes = {};
    busStub = { nameHasOwner: jest.fn().mockResolvedValue(true) };

    jest.mocked(spawn).mockImplementation(((command: string) => {
      processes[command] = new EventEmitter();

      return processes[command];
    }) as unknown as typeof spawn);
    jest.mocked(getOrcaInstallationPath).mockReturnValue(mockInstallationPath);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("when the Orca service appears", () => {
    let result: Awaited<ReturnType<typeof startOrca>>;

    beforeEach(async () => {
      result = await start();
    });

    it("should start Orca with the guidepup profile", () => {
      expect(spawn).toHaveBeenCalledWith(
        mockOrcaExecutable,
        ["--profile", "guidepup", "--replace"],
        {
          env: expect.objectContaining({
            DBUS_SESSION_BUS_ADDRESS: mockDBusAddress,
            DISPLAY: mockDisplay,
            SPEECHD_ADDRESS: mockSpeechdAddress,
          }),
        },
      );
    });

    it("should log the output of Orca", () => {
      expect(logProcessOutput).toHaveBeenCalledWith(
        processes[mockOrcaExecutable],
        "orca",
      );
    });

    it("should not start an Orca debug log", () => {
      expect(spawn).toHaveBeenCalledTimes(1);
      expect(writeFileSync).not.toHaveBeenCalled();
    });

    it("should wait for the Orca service", () => {
      expect(busStub.nameHasOwner).toHaveBeenCalledWith(ORCA_SERVICE);
    });

    it("should return Orca without a debug log process", () => {
      expect(result).toEqual({
        process: processes[mockOrcaExecutable],
        debugLogProcess: null,
      });
    });
  });

  describe("when debug logging is enabled", () => {
    let result: Awaited<ReturnType<typeof startOrca>>;

    beforeEach(async () => {
      debug.enabled = true;

      result = await start();
    });

    it("should start Orca with a debug log in the runtime directory", () => {
      expect(writeFileSync).toHaveBeenCalledWith(mockDebugLogPath, "");
      expect(spawn).toHaveBeenCalledWith(
        mockOrcaExecutable,
        [
          "--profile",
          "guidepup",
          "--replace",
          "--debug",
          `--debug-file=${mockDebugLogPath}`,
        ],
        expect.anything(),
      );
    });

    it("should follow the debug log", () => {
      expect(spawn).toHaveBeenCalledWith("tail", ["-f", mockDebugLogPath], {
        stdio: ["ignore", "inherit", "pipe"],
      });
    });

    it("should log the output of the debug log process", () => {
      expect(logProcessOutput).toHaveBeenCalledWith(
        processes.tail,
        "orca-debug-log",
      );
    });

    it("should return Orca and the debug log process", () => {
      expect(result).toEqual({
        process: processes[mockOrcaExecutable],
        debugLogProcess: processes.tail,
      });
    });
  });

  describe("when the Orca service takes a while to appear", () => {
    beforeEach(async () => {
      busStub.nameHasOwner
        .mockRejectedValueOnce(new Error("test-error"))
        .mockResolvedValueOnce(false);

      await start();
    });

    it("should poll until it appears", () => {
      expect(busStub.nameHasOwner).toHaveBeenCalledTimes(3);
    });
  });

  describe("when the Orca service never appears", () => {
    beforeEach(() => {
      debug.enabled = true;
      busStub.nameHasOwner.mockResolvedValue(false);
    });

    it("should stop Orca, then its debug log, and throw", async () => {
      await expect(start()).rejects.toThrow(ERR_ORCA_SERVICE_TIMEOUT);

      expect(jest.mocked(terminateProcess).mock.calls).toEqual([
        [processes[mockOrcaExecutable], "Orca"],
        [processes.tail, "Orca debug log"],
      ]);
    });
  });
});
