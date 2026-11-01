import {
  ERR_ORCA_DBUS_CONNECTION_TIMEOUT,
  ERR_ORCA_DBUS_START_FAILURE,
} from "../errors";
import EventEmitter from "node:events";
import { logProcessOutput } from "./logProcessOutput";
import { sessionBus } from "dbus-native";
import { spawn } from "node:child_process";
import { startSessionDBus } from "./startSessionDBus";
import { terminateProcess } from "./terminateProcess";

jest.mock("node:child_process", () => ({
  spawn: jest.fn(),
}));
jest.mock("dbus-native", () => ({
  sessionBus: jest.fn(),
}));
jest.mock("../../debug", () => {
  const debug = jest.fn();

  return { base: { extend: () => debug } };
});
jest.mock("./logProcessOutput", () => ({
  logProcessOutput: jest.fn(),
}));
jest.mock("./terminateProcess", () => ({
  terminateProcess: jest.fn(),
}));

class FakeProcess extends EventEmitter {
  stdout = new EventEmitter();
}

const mockDisplay = "test-display";
const mockDBusAddress = "test-dbus-address";

describe("startSessionDBus", () => {
  const originalEnv = process.env;

  let daemon: FakeProcess;
  let busStub: { close: jest.Mock; listNames: jest.Mock };

  /**
   * Starts the session D-Bus, flushing the timers of any polling.
   */
  const start = async () => {
    const promise = startSessionDBus(mockDisplay);

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
    delete process.env.DBUS_SESSION_BUS_ADDRESS;

    daemon = new FakeProcess();

    jest.mocked(spawn).mockImplementation((() => {
      process.nextTick(() =>
        daemon.stdout.emit("data", Buffer.from(`${mockDBusAddress}\n`)),
      );

      return daemon;
    }) as unknown as typeof spawn);

    busStub = {
      close: jest.fn().mockResolvedValue(undefined),
      listNames: jest.fn().mockResolvedValue([]),
    };

    jest
      .mocked(sessionBus)
      .mockReturnValue(busStub as unknown as ReturnType<typeof sessionBus>);
  });

  afterEach(() => {
    process.env = originalEnv;

    jest.useRealTimers();
  });

  describe("when DBUS_SESSION_BUS_ADDRESS is not set", () => {
    let result: Awaited<ReturnType<typeof startSessionDBus>>;

    beforeEach(async () => {
      result = await start();
    });

    it("should start a D-Bus daemon on the display", () => {
      expect(spawn).toHaveBeenCalledWith(
        "dbus-daemon",
        ["--session", "--nofork", "--print-address"],
        { env: expect.objectContaining({ DISPLAY: mockDisplay }) },
      );
    });

    it("should log the output of the D-Bus daemon", () => {
      expect(logProcessOutput).toHaveBeenCalledWith(daemon, "dbus");
    });

    it("should connect to the address the daemon prints", () => {
      expect(sessionBus).toHaveBeenCalledWith({ busAddress: mockDBusAddress });
    });

    it("should wait for the bus to respond", () => {
      expect(busStub.listNames).toHaveBeenCalled();
    });

    it("should return the address, the connection and the daemon", () => {
      expect(result).toEqual({
        address: mockDBusAddress,
        bus: busStub,
        process: daemon,
      });
    });
  });

  describe("when DBUS_SESSION_BUS_ADDRESS is set", () => {
    let result: Awaited<ReturnType<typeof startSessionDBus>>;

    beforeEach(async () => {
      process.env.DBUS_SESSION_BUS_ADDRESS = "test-existing-dbus-address";

      result = await start();
    });

    it("should connect to the existing session D-Bus", () => {
      expect(spawn).not.toHaveBeenCalled();
      expect(sessionBus).toHaveBeenCalledWith({
        busAddress: "test-existing-dbus-address",
      });
    });

    it("should return the connection without a process", () => {
      expect(result).toEqual({
        address: "test-existing-dbus-address",
        bus: busStub,
        process: null,
      });
    });
  });

  describe.each(["exit", "error"])(
    "when the D-Bus daemon emits %s before printing its address",
    (event) => {
      beforeEach(() => {
        jest.mocked(spawn).mockImplementation((() => {
          process.nextTick(() =>
            daemon.emit(event, event === "error" ? new Error("test-error") : 1),
          );

          return daemon;
        }) as unknown as typeof spawn);
      });

      it("should stop the daemon and throw without connecting", async () => {
        await expect(start()).rejects.toThrow(ERR_ORCA_DBUS_START_FAILURE);

        expect(terminateProcess).toHaveBeenCalledWith(daemon, "session D-Bus");
        expect(sessionBus).not.toHaveBeenCalled();
      });
    },
  );

  describe("when the bus takes a while to respond", () => {
    beforeEach(async () => {
      busStub.listNames.mockRejectedValueOnce(new Error("test-error"));

      await start();
    });

    it("should poll until it responds", () => {
      expect(busStub.listNames).toHaveBeenCalledTimes(2);
    });
  });

  describe("when the bus never responds", () => {
    beforeEach(() => {
      busStub.listNames.mockRejectedValue(new Error("test-error"));
    });

    it("should stop the daemon, then close the connection, and throw", async () => {
      await expect(start()).rejects.toThrow(ERR_ORCA_DBUS_CONNECTION_TIMEOUT);

      expect(terminateProcess).toHaveBeenCalledWith(daemon, "session D-Bus");
      expect(busStub.close).toHaveBeenCalled();
      expect(
        jest.mocked(terminateProcess).mock.invocationCallOrder[0],
      ).toBeLessThan(busStub.close.mock.invocationCallOrder[0]);
    });
  });
});
