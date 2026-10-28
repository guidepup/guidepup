import {
  ERR_ORCA_AT_SPI_LAUNCHER_MISSING,
  ERR_ORCA_AT_SPI_SERVICE_TIMEOUT,
} from "../errors";
import { existsSync } from "node:fs";
import { isAtSpiRunning } from "./isAtSpiRunning";
import { logProcessOutput } from "./logProcessOutput";
import type { SessionDBus } from "./startSessionDBus";
import { spawn } from "node:child_process";
import { startAtSpi } from "./startAtSpi";
import { terminateAtSpi } from "./terminateAtSpi";

jest.mock("node:child_process", () => ({
  spawn: jest.fn(),
}));
jest.mock("node:fs", () => ({
  existsSync: jest.fn(),
}));
jest.mock("../../debug", () => {
  const debug = jest.fn();

  return { base: { extend: () => debug } };
});
jest.mock("./isAtSpiRunning", () => ({
  isAtSpiRunning: jest.fn(),
}));
jest.mock("./logProcessOutput", () => ({
  logProcessOutput: jest.fn(),
}));
jest.mock("./terminateAtSpi", () => ({
  terminateAtSpi: jest.fn(),
}));

const AT_SPI_LAUNCHER = "/usr/libexec/at-spi-bus-launcher";
const AT_SPI_LAUNCHER_FALLBACK = "/usr/lib/at-spi2-core/at-spi-bus-launcher";
const AT_SPI_SERVICE = "org.a11y.Bus";
const mockDisplay = "test-display";
const mockDBusAddress = "test-dbus-address";
const launcherStub = Symbol("test-launcher");

describe("startAtSpi", () => {
  let busStub: { nameHasOwner: jest.Mock };

  /**
   * Starts AT-SPI, flushing the timers of any polling.
   */
  const start = async () => {
    const promise = startAtSpi(mockDisplay, {
      address: mockDBusAddress,
      bus: busStub,
      process: null,
    } as unknown as SessionDBus);

    promise.catch(() => {});

    await jest.runAllTimersAsync();

    return promise;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({
      doNotFake: ["nextTick", "queueMicrotask", "setImmediate"],
    });

    busStub = { nameHasOwner: jest.fn().mockResolvedValue(true) };

    jest.mocked(spawn).mockReturnValue(launcherStub as never);
    jest.mocked(existsSync).mockReturnValue(true);
    jest.mocked(isAtSpiRunning).mockReturnValue(false);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("when AT-SPI is not running", () => {
    let result: Awaited<ReturnType<typeof startAtSpi>>;

    beforeEach(async () => {
      result = await start();
    });

    it("should start the AT-SPI bus launcher in its own process group", () => {
      expect(spawn).toHaveBeenCalledWith(
        AT_SPI_LAUNCHER,
        ["--launch-immediately"],
        {
          detached: true,
          env: expect.objectContaining({
            DBUS_SESSION_BUS_ADDRESS: mockDBusAddress,
            DISPLAY: mockDisplay,
          }),
        },
      );
    });

    it("should log the output of the launcher", () => {
      expect(logProcessOutput).toHaveBeenCalledWith(launcherStub, "at-spi");
    });

    it("should wait for the accessibility bus", () => {
      expect(busStub.nameHasOwner).toHaveBeenCalledWith(AT_SPI_SERVICE);
    });

    it("should return the launcher", () => {
      expect(result).toBe(launcherStub);
    });
  });

  describe("when AT-SPI is already running", () => {
    let result: Awaited<ReturnType<typeof startAtSpi>>;

    beforeEach(async () => {
      jest.mocked(isAtSpiRunning).mockReturnValue(true);

      result = await start();
    });

    it("should not start the AT-SPI bus launcher", () => {
      expect(spawn).not.toHaveBeenCalled();
    });

    it("should still wait for the accessibility bus", () => {
      expect(busStub.nameHasOwner).toHaveBeenCalledWith(AT_SPI_SERVICE);
    });

    it("should return no launcher", () => {
      expect(result).toBeNull();
    });
  });

  describe("when only the fallback launcher exists", () => {
    beforeEach(async () => {
      jest
        .mocked(existsSync)
        .mockImplementation((path) => path === AT_SPI_LAUNCHER_FALLBACK);

      await start();
    });

    it("should start the fallback launcher", () => {
      expect(spawn).toHaveBeenCalledWith(
        AT_SPI_LAUNCHER_FALLBACK,
        ["--launch-immediately"],
        expect.anything(),
      );
    });
  });

  describe("when no launcher exists", () => {
    it("should throw without starting anything", async () => {
      jest.mocked(existsSync).mockReturnValue(false);

      await expect(start()).rejects.toThrow(ERR_ORCA_AT_SPI_LAUNCHER_MISSING);

      expect(spawn).not.toHaveBeenCalled();
    });
  });

  describe("when the accessibility bus takes a while to appear", () => {
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

  describe("when the accessibility bus never appears", () => {
    beforeEach(() => {
      busStub.nameHasOwner.mockResolvedValue(false);
    });

    it("should stop the launcher it started and throw", async () => {
      await expect(start()).rejects.toThrow(ERR_ORCA_AT_SPI_SERVICE_TIMEOUT);

      expect(terminateAtSpi).toHaveBeenCalledWith(launcherStub);
    });

    describe("when AT-SPI was already running", () => {
      it("should have no launcher to stop", async () => {
        jest.mocked(isAtSpiRunning).mockReturnValue(true);

        await expect(start()).rejects.toThrow(ERR_ORCA_AT_SPI_SERVICE_TIMEOUT);

        expect(terminateAtSpi).toHaveBeenCalledWith(null);
      });
    });
  });
});
