import {
  ERR_ORCA_AT_SPI_LAUNCHER_MISSING,
  ERR_ORCA_AT_SPI_SERVICE_TIMEOUT,
  ERR_ORCA_CANNOT_BE_STARTED,
  ERR_ORCA_DBUS_CONNECTION_TIMEOUT,
  ERR_ORCA_DBUS_START_FAILURE,
  ERR_ORCA_NOT_RUNNING,
  ERR_ORCA_SERVICE_TIMEOUT,
  ERR_ORCA_SPEECH_DISPATCHER_SERVICE_TIMEOUT,
  ERR_ORCA_SPEECHD_CANNOT_CONNECT,
  ERR_ORCA_X_SERVER_TIMEOUT,
} from "../errors";
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { sessionBus, UnknownInterfaceError } from "dbus-native";
import { base } from "../../debug";
import { connect } from "node:net";
import EventEmitter from "node:events";
import { findAvailableDisplay } from "./findAvailableDisplay";
import { getOrcaInstallationPath } from "./getOrcaInstallationPath";
import { isAtSpiRunning } from "./isAtSpiRunning";
import { isUnixSocket } from "./isUnixSocket";
import { join } from "node:path";
import { OrcaClient } from "./OrcaClient";
import { terminateProcess } from "./terminateProcess";

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
  spawn: jest.fn(),
}));
jest.mock("node:fs", () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  mkdtempSync: jest.fn(),
  rmSync: jest.fn(),
  writeFileSync: jest.fn(),
}));
jest.mock("node:net", () => ({
  connect: jest.fn(),
}));
jest.mock("dbus-native", () => {
  class UnknownInterfaceError extends Error {}

  return { sessionBus: jest.fn(), UnknownInterfaceError };
});
jest.mock("../../debug", () => {
  const debug = Object.assign(jest.fn(), { enabled: false });

  return { base: { extend: () => debug } };
});
jest.mock("./findAvailableDisplay", () => ({
  findAvailableDisplay: jest.fn(),
}));
jest.mock("./getOrcaInstallationPath", () => ({
  getOrcaInstallationPath: jest.fn(),
}));
jest.mock("./isAtSpiRunning", () => ({
  isAtSpiRunning: jest.fn(),
}));
jest.mock("./isUnixSocket", () => ({
  isUnixSocket: jest.fn(),
}));
jest.mock("./terminateProcess", () => ({
  terminateProcess: jest.fn(),
}));
jest.mock("./serviceDefinition", () => ({
  serviceDefinition: {
    modules: {
      MousePresenter: {
        objectPath: "/org/gnome/Orca1/Service/MousePresenter",
        commands: {
          ToggleMouseReview: { description: "test-description" },
        },
        parameterizedCommands: {},
        runtimeGetters: {},
        runtimeSetters: {},
      },
      ObjectNavigator: {
        objectPath: "/org/gnome/Orca1/Service/ObjectNavigator",
        commands: {
          MoveToNextSibling: { description: "test-description" },
        },
      },
      SpeechPresenter: {
        objectPath: "/org/gnome/Orca1/Service/SpeechPresenter",
        commands: {
          ToggleMonitor: { description: "test-description" },
        },
        parameterizedCommands: {
          SetRate: { description: "test-description" },
        },
        runtimeGetters: {
          Rate: { description: "test-description" },
        },
        runtimeSetters: {
          Rate: { description: "test-description" },
        },
      },
    },
  },
}));

const debug = base.extend("test") as unknown as jest.Mock & {
  enabled: boolean;
};

const mockDisplay = "test-display";
const mockDBusAddress = "test-dbus-address";
const mockInstallationPath = "test-installation-path";
const mockRuntimeDirectory = "test-runtime-directory";
const mockSpeechdSocketPath = join(mockRuntimeDirectory, "speechd.sock");
const mockGuidepupSocketPath = join(mockRuntimeDirectory, "guidepup.sock");
const mockOrcaExecutable = join(mockInstallationPath, "bin", "orca");
const AT_SPI_LAUNCHER = "/usr/libexec/at-spi-bus-launcher";
const AT_SPI_LAUNCHER_FALLBACK = "/usr/lib/at-spi2-core/at-spi-bus-launcher";
const ORCA_SERVICE = "org.gnome.Orca1.Service";
const AT_SPI_SERVICE = "org.a11y.Bus";
const mockAtSpiBusAddress = "test-at-spi-bus-address";

class FakeProcess extends EventEmitter {
  stdout = new EventEmitter();
  stderr = new EventEmitter();
  pid: number | undefined;

  constructor(pid: number) {
    super();

    this.pid = pid;
  }
}

class FakeSocket extends EventEmitter {
  setEncoding = jest.fn();
  destroy = jest.fn();

  send(line: string) {
    this.emit("data", `${line}\n`);
  }
}

type SocketBehaviour = "ready" | "error";

const stubParameterizedCommandResult = Symbol(
  "test-parameterized-command-result",
);
const stubRuntimeGetterResult = Symbol("test-runtime-getter-result");

const interfaceStub = () => ({
  MoveToNextSibling: jest.fn().mockResolvedValue(undefined),
  SetRate: jest.fn().mockResolvedValue(stubParameterizedCommandResult),
  ToggleMonitor: jest.fn().mockResolvedValue(undefined),
  ToggleMouseReview: jest.fn().mockResolvedValue(undefined),
  $readProp: jest.fn().mockResolvedValue(stubRuntimeGetterResult),
  $writeProp: jest.fn().mockResolvedValue(undefined),
});

describe("OrcaClient", () => {
  const originalEnv = process.env;

  let client: OrcaClient;
  let processes: Record<string, FakeProcess[]>;
  let sockets: FakeSocket[];
  let socketBehaviours: SocketBehaviour[];
  let interfaces: Record<string, ReturnType<typeof interfaceStub>>;
  let busStub: {
    close: jest.Mock;
    getService: jest.Mock;
    listNames: jest.Mock;
    nameHasOwner: jest.Mock;
  };
  let orcaServiceStub: { getInterface: jest.Mock };
  let a11yBusInterfaceStub: { GetAddress: jest.Mock };
  let a11yServiceStub: { getInterface: jest.Mock };
  let deviceEventControllerStub: { GenerateKeyboardEvent: jest.Mock };
  let atSpiRegistryStub: { getInterface: jest.Mock };
  let atSpiBusStub: { close: jest.Mock; getService: jest.Mock };
  let processKillSpy: jest.SpyInstance;

  const lastProcess = (command: string) => processes[command]?.at(-1);
  const lastSocket = () => sockets.at(-1);
  const speak = (data: string) =>
    lastSocket().send(JSON.stringify({ type: "speech", data }));

  /**
   * Starts the client, flushing the timers of any polling.
   */
  const start = async (...args: Parameters<OrcaClient["start"]>) => {
    const promise = client.start(...args);

    promise.catch(() => {});

    await jest.runAllTimersAsync();

    return promise;
  };

  /**
   * Starts the client, returning the error it fails with.
   */
  const startError = async (
    ...args: Parameters<OrcaClient["start"]>
  ): Promise<Error> => {
    try {
      await start(...args);
    } catch (error) {
      return error;
    }

    throw new Error("Expected start to fail");
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({
      doNotFake: ["nextTick", "queueMicrotask", "setImmediate"],
    });

    process.env = { ...originalEnv };
    delete process.env.DISPLAY;
    delete process.env.DBUS_SESSION_BUS_ADDRESS;

    debug.enabled = false;

    processes = {};
    sockets = [];
    socketBehaviours = [];
    interfaces = {
      MousePresenter: interfaceStub(),
      ObjectNavigator: interfaceStub(),
      SpeechPresenter: interfaceStub(),
    };

    let pid = 1000;

    jest.mocked(spawn).mockImplementation(((command: string) => {
      const child = new FakeProcess(pid++);

      (processes[command] ??= []).push(child);

      if (command === "dbus-daemon") {
        process.nextTick(() =>
          child.stdout.emit("data", Buffer.from(`${mockDBusAddress}\n`)),
        );
      }

      return child;
    }) as unknown as typeof spawn);

    jest.mocked(connect).mockImplementation(((
      _path: string,
      onConnect: () => void,
    ) => {
      const socket = new FakeSocket();
      const behaviour = socketBehaviours.shift() ?? "ready";

      sockets.push(socket);

      process.nextTick(() => {
        if (behaviour === "error") {
          socket.emit("error", new Error("test-socket-error"));

          return;
        }

        onConnect();
        socket.send(JSON.stringify({ type: "ready" }));
      });

      return socket;
    }) as unknown as typeof connect);

    a11yBusInterfaceStub = {
      GetAddress: jest.fn().mockResolvedValue(mockAtSpiBusAddress),
    };

    a11yServiceStub = {
      getInterface: jest.fn().mockResolvedValue(a11yBusInterfaceStub),
    };

    orcaServiceStub = {
      getInterface: jest.fn(async (_objectPath: string, name: string) => {
        return interfaces[name.replace("org.gnome.Orca1.", "")];
      }),
    };

    deviceEventControllerStub = {
      GenerateKeyboardEvent: jest.fn().mockResolvedValue(undefined),
    };

    atSpiRegistryStub = {
      getInterface: jest.fn().mockResolvedValue(deviceEventControllerStub),
    };

    atSpiBusStub = {
      close: jest.fn().mockResolvedValue(undefined),
      getService: jest.fn().mockReturnValue(atSpiRegistryStub),
    };

    busStub = {
      close: jest.fn().mockResolvedValue(undefined),
      getService: jest.fn((name: string) =>
        name === AT_SPI_SERVICE ? a11yServiceStub : orcaServiceStub,
      ),
      listNames: jest.fn().mockResolvedValue([]),
      nameHasOwner: jest.fn().mockResolvedValue(true),
    };

    jest
      .mocked(sessionBus)
      .mockImplementation(
        ({ busAddress }) =>
          (busAddress === mockAtSpiBusAddress
            ? atSpiBusStub
            : busStub) as unknown as ReturnType<typeof sessionBus>,
      );
    jest.mocked(execFileSync).mockReturnValue(Buffer.from(""));
    jest.mocked(existsSync).mockReturnValue(true);
    jest.mocked(mkdtempSync).mockReturnValue(mockRuntimeDirectory);
    jest.mocked(findAvailableDisplay).mockReturnValue(mockDisplay);
    jest.mocked(getOrcaInstallationPath).mockReturnValue(mockInstallationPath);
    jest.mocked(isAtSpiRunning).mockReturnValue(false);
    jest.mocked(isUnixSocket).mockReturnValue(true);

    processKillSpy = jest.spyOn(process, "kill").mockReturnValue(true);

    client = new OrcaClient();
  });

  afterEach(() => {
    process.env = originalEnv;

    processKillSpy.mockRestore();
    jest.useRealTimers();
  });

  describe("start", () => {
    describe("when nothing is running yet", () => {
      beforeEach(async () => {
        await start();
      });

      it("should create a runtime directory for the session", () => {
        expect(mkdtempSync).toHaveBeenCalledWith(
          expect.stringMatching(/guidepup-orca-$/),
        );
      });

      it("should start an X server on an available display", () => {
        expect(spawn).toHaveBeenCalledWith("Xvfb", [
          mockDisplay,
          "-screen",
          "0",
          "1280x720x24",
        ]);
        expect(execFileSync).toHaveBeenCalledWith("xdpyinfo", [
          "-display",
          mockDisplay,
        ]);
      });

      it("should start a session D-Bus and connect to it", () => {
        expect(spawn).toHaveBeenCalledWith(
          "dbus-daemon",
          ["--session", "--nofork", "--print-address"],
          { env: expect.objectContaining({ DISPLAY: mockDisplay }) },
        );
        expect(sessionBus).toHaveBeenCalledWith({
          busAddress: mockDBusAddress,
        });
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
        expect(busStub.nameHasOwner).toHaveBeenCalledWith(AT_SPI_SERVICE);
      });

      it("should connect to the AT-SPI device event controller on the accessibility bus", () => {
        expect(busStub.getService).toHaveBeenCalledWith(AT_SPI_SERVICE);
        expect(a11yServiceStub.getInterface).toHaveBeenCalledWith(
          "/org/a11y/bus",
          AT_SPI_SERVICE,
        );
        expect(sessionBus).toHaveBeenCalledWith({
          busAddress: mockAtSpiBusAddress,
        });
        expect(atSpiBusStub.getService).toHaveBeenCalledWith(
          "org.a11y.atspi.Registry",
        );
        expect(atSpiRegistryStub.getInterface).toHaveBeenCalledWith(
          "/org/a11y/atspi/registry/deviceeventcontroller",
          "org.a11y.atspi.DeviceEventController",
        );
      });

      it("should start Speech Dispatcher with the session sockets", () => {
        expect(spawn).toHaveBeenCalledWith(
          "speech-dispatcher",
          [
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
        expect(isUnixSocket).toHaveBeenCalledWith(mockSpeechdSocketPath);
      });

      it("should connect to the guidepup speech socket", () => {
        expect(connect).toHaveBeenCalledWith(
          mockGuidepupSocketPath,
          expect.any(Function),
        );
        expect(lastSocket().setEncoding).toHaveBeenCalledWith("utf8");
      });

      it("should start Orca with the guidepup profile", () => {
        expect(spawn).toHaveBeenCalledWith(
          mockOrcaExecutable,
          ["--profile", "guidepup", "--replace"],
          {
            env: expect.objectContaining({
              DBUS_SESSION_BUS_ADDRESS: mockDBusAddress,
              DISPLAY: mockDisplay,
              SPEECHD_ADDRESS: `unix_socket:${mockSpeechdSocketPath}`,
            }),
          },
        );
        expect(busStub.nameHasOwner).toHaveBeenCalledWith(ORCA_SERVICE);
      });

      it("should not start an Orca debug log", () => {
        expect(spawn).not.toHaveBeenCalledWith(
          "tail",
          expect.anything(),
          expect.anything(),
        );
        expect(writeFileSync).not.toHaveBeenCalled();
      });

      it("should map each Orca D-Bus module", () => {
        expect(busStub.getService).toHaveBeenCalledWith(ORCA_SERVICE);
        expect(orcaServiceStub.getInterface).toHaveBeenCalledWith(
          "/org/gnome/Orca1/Service/ObjectNavigator",
          "org.gnome.Orca1.ObjectNavigator",
        );
      });

      it("should toggle the speech monitor without notifying the user", () => {
        expect(interfaces.SpeechPresenter.ToggleMonitor).toHaveBeenCalledWith(
          false,
        );
      });

      it("should log the output of each process", () => {
        Object.values(processes)
          .flat()
          .forEach((child) => {
            child.stdout.emit("data", Buffer.from("test-stdout\n"));
            child.stderr.emit("data", Buffer.from("test-stderr\n"));
            child.emit("error", new Error("test-error"));
            child.emit("exit", 0, null);
          });

        expect(debug).toHaveBeenCalledWith("[xvfb] test-stdout");
        expect(debug).toHaveBeenCalledWith("[dbus] test-stderr");
        expect(debug).toHaveBeenCalledWith(
          "[at-spi] process error: test-error",
        );
        expect(debug).toHaveBeenCalledWith(
          "[speechd] exited with code=0, signal=null",
        );
        expect(debug).toHaveBeenCalledWith("[orca] test-stdout");
      });

      describe("when started again", () => {
        beforeEach(async () => {
          jest.clearAllMocks();

          await start();
        });

        it("should do nothing", () => {
          expect(spawn).not.toHaveBeenCalled();
        });
      });
    });

    describe("when already starting", () => {
      it("should do nothing", async () => {
        const first = client.start();
        const second = client.start();

        await jest.runAllTimersAsync();
        await Promise.all([first, second]);

        expect(spawn).toHaveBeenCalledTimes(5);
      });
    });

    describe("when debug logging is enabled", () => {
      const mockDebugLogPath = join(mockRuntimeDirectory, "orca-debug.log");

      beforeEach(async () => {
        debug.enabled = true;

        await start();
      });

      it("should start Speech Dispatcher with verbose logging", () => {
        expect(spawn).toHaveBeenCalledWith(
          "speech-dispatcher",
          expect.arrayContaining(["--log-level", "5"]),
          expect.anything(),
        );
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
        const tail = lastProcess("tail");

        tail.stderr.emit("data", Buffer.from("test-stderr\n"));
        tail.emit("error", new Error("test-error"));
        tail.emit("exit", 0, null);

        expect(debug).toHaveBeenCalledWith("[orca-debug-log] test-stderr");
        expect(debug).toHaveBeenCalledWith(
          "[orca-debug-log] process error: test-error",
        );
        expect(debug).toHaveBeenCalledWith(
          "[orca-debug-log] exited with code=0, signal=null",
        );
      });
    });

    describe("X server", () => {
      describe("when DISPLAY is set", () => {
        beforeEach(async () => {
          process.env.DISPLAY = "test-existing-display";

          await start();
        });

        it("should use the existing X server", () => {
          expect(findAvailableDisplay).not.toHaveBeenCalled();
          expect(spawn).not.toHaveBeenCalledWith("Xvfb", expect.anything());
          expect(execFileSync).toHaveBeenCalledWith("xdpyinfo", [
            "-display",
            "test-existing-display",
          ]);
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
        it("should fail to start", async () => {
          jest.mocked(execFileSync).mockImplementation(() => {
            throw new Error("test-error");
          });

          const error = await startError();

          expect(error.message).toBe(ERR_ORCA_CANNOT_BE_STARTED);
          expect((error.cause as Error).message).toBe(
            ERR_ORCA_X_SERVER_TIMEOUT,
          );
        });
      });
    });

    describe("session D-Bus", () => {
      describe("when DBUS_SESSION_BUS_ADDRESS is set", () => {
        beforeEach(async () => {
          process.env.DBUS_SESSION_BUS_ADDRESS = "test-existing-dbus-address";

          await start();
        });

        it("should connect to the existing session D-Bus", () => {
          expect(spawn).not.toHaveBeenCalledWith(
            "dbus-daemon",
            expect.anything(),
            expect.anything(),
          );
          expect(sessionBus).toHaveBeenCalledWith({
            busAddress: "test-existing-dbus-address",
          });
        });
      });

      describe.each(["exit", "error"])(
        "when the D-Bus daemon emits %s before printing its address",
        (event) => {
          it("should fail to start", async () => {
            jest.mocked(spawn).mockImplementationOnce((() => {
              const child = new FakeProcess(1);

              process.nextTick(() =>
                child.emit(
                  event,
                  event === "error" ? new Error("test-error") : 1,
                ),
              );

              return child;
            }) as unknown as typeof spawn);
            jest.mocked(spawn).mockImplementationOnce((() => {
              const child = new FakeProcess(2);

              process.nextTick(() =>
                child.emit(
                  event,
                  event === "error" ? new Error("test-error") : 1,
                ),
              );

              return child;
            }) as unknown as typeof spawn);

            const error = await startError();

            expect((error.cause as Error).message).toBe(
              ERR_ORCA_DBUS_START_FAILURE,
            );
          });
        },
      );

      describe("when the session D-Bus takes a while to respond", () => {
        beforeEach(async () => {
          busStub.listNames.mockRejectedValueOnce(new Error("test-error"));

          await start();
        });

        it("should poll until it responds", () => {
          expect(busStub.listNames).toHaveBeenCalledTimes(2);
        });
      });

      describe("when the session D-Bus never responds", () => {
        it("should fail to start", async () => {
          busStub.listNames.mockRejectedValue(new Error("test-error"));

          const error = await startError();

          expect((error.cause as Error).message).toBe(
            ERR_ORCA_DBUS_CONNECTION_TIMEOUT,
          );
        });
      });
    });

    describe("AT-SPI", () => {
      describe("when AT-SPI is already running", () => {
        beforeEach(async () => {
          jest.mocked(isAtSpiRunning).mockReturnValue(true);

          await start();
        });

        it("should not start the AT-SPI bus launcher", () => {
          expect(spawn).not.toHaveBeenCalledWith(
            AT_SPI_LAUNCHER,
            expect.anything(),
            expect.anything(),
          );
        });

        it("should still wait for the AT-SPI service", () => {
          expect(busStub.nameHasOwner).toHaveBeenCalledWith(AT_SPI_SERVICE);
        });

        describe("when stopped", () => {
          beforeEach(async () => {
            await client.stop();
          });

          it("should not signal an AT-SPI process group", () => {
            expect(processKillSpy).not.toHaveBeenCalled();
          });
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
        it("should fail to start", async () => {
          jest.mocked(existsSync).mockReturnValue(false);

          const error = await startError();

          expect((error.cause as Error).message).toBe(
            ERR_ORCA_AT_SPI_LAUNCHER_MISSING,
          );
        });
      });

      describe("when the AT-SPI service takes a while to appear", () => {
        beforeEach(async () => {
          busStub.nameHasOwner
            .mockRejectedValueOnce(new Error("test-error"))
            .mockResolvedValueOnce(false);

          await start();
        });

        it("should poll until it appears", () => {
          expect(
            busStub.nameHasOwner.mock.calls.filter(
              ([name]) => name === AT_SPI_SERVICE,
            ),
          ).toHaveLength(3);
        });
      });

      describe("when the AT-SPI service never appears", () => {
        it("should fail to start", async () => {
          busStub.nameHasOwner.mockResolvedValue(false);

          const error = await startError();

          expect((error.cause as Error).message).toBe(
            ERR_ORCA_AT_SPI_SERVICE_TIMEOUT,
          );
        });
      });
    });

    describe("Speech Dispatcher", () => {
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
        it("should fail to start", async () => {
          jest.mocked(isUnixSocket).mockReturnValue(false);

          const error = await startError();

          expect((error.cause as Error).message).toBe(
            ERR_ORCA_SPEECH_DISPATCHER_SERVICE_TIMEOUT,
          );
        });
      });

      describe("when the guidepup speech socket refuses a few connections", () => {
        beforeEach(async () => {
          socketBehaviours = ["error", "error"];

          await start();
        });

        it("should retry until it connects", () => {
          expect(connect).toHaveBeenCalledTimes(3);
        });

        it("should destroy each failed socket", () => {
          expect(sockets[0].destroy).toHaveBeenCalled();
          expect(sockets[1].destroy).toHaveBeenCalled();
        });
      });

      describe("when the guidepup speech socket refuses every connection", () => {
        it("should fail to start after 20 attempts", async () => {
          socketBehaviours = Array(20).fill("error");

          const error = await startError();

          expect((error.cause as Error).message).toBe(
            ERR_ORCA_SPEECHD_CANNOT_CONNECT,
          );
          expect(connect).toHaveBeenCalledTimes(20);
        });
      });
    });

    describe("Orca", () => {
      describe("when the Orca service takes a while to appear", () => {
        beforeEach(async () => {
          busStub.nameHasOwner.mockImplementation(async (name: string) => {
            if (name !== ORCA_SERVICE) {
              return true;
            }

            const calls = busStub.nameHasOwner.mock.calls.filter(
              ([name]) => name === ORCA_SERVICE,
            ).length;

            if (calls === 1) {
              throw new Error("test-error");
            }

            return calls > 2;
          });

          await start();
        });

        it("should poll until it appears", () => {
          expect(
            busStub.nameHasOwner.mock.calls.filter(
              ([name]) => name === ORCA_SERVICE,
            ),
          ).toHaveLength(3);
        });
      });

      describe("when the Orca service never appears", () => {
        it("should fail to start", async () => {
          busStub.nameHasOwner.mockImplementation(
            async (name: string) => name !== ORCA_SERVICE,
          );

          const error = await startError();

          expect((error.cause as Error).message).toBe(ERR_ORCA_SERVICE_TIMEOUT);
        });
      });
    });

    describe("Orca D-Bus modules", () => {
      const unknownInterface = () =>
        new UnknownInterfaceError("test-unknown-interface");

      describe("when a module takes a while to register", () => {
        beforeEach(async () => {
          orcaServiceStub.getInterface.mockRejectedValueOnce(
            unknownInterface(),
          );

          await start();
        });

        it("should retry until it is registered", () => {
          expect(orcaServiceStub.getInterface).toHaveBeenCalledTimes(4);
        });
      });

      describe("when a required module never registers", () => {
        it("should fail to start", async () => {
          orcaServiceStub.getInterface.mockImplementation(
            async (_objectPath: string, name: string) => {
              if (name === "org.gnome.Orca1.ObjectNavigator") {
                throw unknownInterface();
              }

              return interfaces[name.replace("org.gnome.Orca1.", "")];
            },
          );

          const error = await startError();

          expect((error.cause as Error).message).toBe(
            "Timed out waiting for Orca D-Bus interface 'org.gnome.Orca1.ObjectNavigator'.",
          );
        });
      });

      describe("when the optional MousePresenter module never registers", () => {
        beforeEach(async () => {
          orcaServiceStub.getInterface.mockImplementation(
            async (_objectPath: string, name: string) => {
              if (name === "org.gnome.Orca1.MousePresenter") {
                throw unknownInterface();
              }

              return interfaces[name.replace("org.gnome.Orca1.", "")];
            },
          );

          await start();
        });

        it("should start without it", () => {
          expect(client.service.MousePresenter).toBeUndefined();
        });
      });

      describe("when getting a module fails for another reason", () => {
        it("should fail to start with the cause", async () => {
          const stubError = new Error("test-error");

          orcaServiceStub.getInterface.mockRejectedValue(stubError);

          const error = await startError();

          expect(error.cause).toBe(stubError);
        });
      });
    });

    describe("when starting fails", () => {
      let error: Error;

      beforeEach(async () => {
        busStub.nameHasOwner.mockImplementation(
          async (name: string) => name !== ORCA_SERVICE,
        );

        error = await startError();
      });

      it("should throw a start error", () => {
        expect(error.message).toBe(ERR_ORCA_CANNOT_BE_STARTED);
      });

      it("should stop every process it started", () => {
        Object.values(processes)
          .flat()
          .forEach((child) => {
            expect(terminateProcess).toHaveBeenCalledWith(
              child,
              expect.any(String),
            );
          });
      });

      it("should remove the runtime directory", () => {
        expect(rmSync).toHaveBeenCalledWith(mockRuntimeDirectory, {
          force: true,
          recursive: true,
        });
      });

      it("should allow a later start", async () => {
        busStub.nameHasOwner.mockResolvedValue(true);

        await expect(start()).resolves.toBeUndefined();
      });
    });
  });

  describe("service", () => {
    describe("when not started", () => {
      it("should throw", () => {
        expect(() => client.service).toThrow(ERR_ORCA_NOT_RUNNING);
      });
    });

    describe("when started", () => {
      beforeEach(async () => {
        await start();
      });

      it("should execute commands, notifying the user by default", async () => {
        await client.service.ObjectNavigator.commands.MoveToNextSibling.execute();

        expect(
          interfaces.ObjectNavigator.MoveToNextSibling,
        ).toHaveBeenCalledWith(true);
      });

      it("should execute commands without notifying the user", async () => {
        await client.service.ObjectNavigator.commands.MoveToNextSibling.execute(
          false,
        );

        expect(
          interfaces.ObjectNavigator.MoveToNextSibling,
        ).toHaveBeenCalledWith(false);
      });

      it("should keep each command's definition", () => {
        expect(
          client.service.ObjectNavigator.commands.MoveToNextSibling,
        ).toEqual(expect.objectContaining({ description: "test-description" }));
      });

      it("should execute parameterized commands", async () => {
        const stubParameter = Symbol("test-parameter");
        const service = client.service as unknown as {
          SpeechPresenter: {
            parameterizedCommands: {
              SetRate: { execute: (...args: unknown[]) => Promise<unknown> };
            };
          };
        };

        await expect(
          service.SpeechPresenter.parameterizedCommands.SetRate.execute(
            stubParameter,
          ),
        ).resolves.toBe(stubParameterizedCommandResult);
        expect(interfaces.SpeechPresenter.SetRate).toHaveBeenCalledWith(
          stubParameter,
        );
      });

      it("should read runtime properties", async () => {
        const service = client.service as unknown as {
          SpeechPresenter: {
            runtimeGetters: { Rate: { get: () => Promise<unknown> } };
          };
        };

        await expect(
          service.SpeechPresenter.runtimeGetters.Rate.get(),
        ).resolves.toBe(stubRuntimeGetterResult);
        expect(interfaces.SpeechPresenter.$readProp).toHaveBeenCalledWith(
          "Rate",
        );
      });

      it("should write runtime properties", async () => {
        const service = client.service as unknown as {
          SpeechPresenter: {
            runtimeSetters: {
              Rate: { set: (value: unknown) => Promise<void> };
            };
          };
        };

        const stubValue = Symbol("test-value");

        await service.SpeechPresenter.runtimeSetters.Rate.set(stubValue);

        expect(interfaces.SpeechPresenter.$writeProp).toHaveBeenCalledWith(
          "Rate",
          stubValue,
        );
      });

      it("should give modules without optional members empty ones", () => {
        expect(client.service.ObjectNavigator).toEqual(
          expect.objectContaining({
            parameterizedCommands: {},
            runtimeGetters: {},
            runtimeSetters: {},
          }),
        );
      });
    });
  });

  describe("stop", () => {
    describe("when not started", () => {
      it("should do nothing", async () => {
        await expect(client.stop()).resolves.toBeUndefined();

        expect(rmSync).not.toHaveBeenCalled();
        expect(processKillSpy).not.toHaveBeenCalled();
      });
    });

    describe("when started", () => {
      beforeEach(async () => {
        await start();
      });

      describe("when every process stops", () => {
        let socket: FakeSocket;

        beforeEach(async () => {
          socket = lastSocket();

          await client.stop();
        });

        it("should disconnect from the speech socket", () => {
          expect(socket.destroy).toHaveBeenCalled();
        });

        it("should stop each process in turn, Orca first and the X server last", () => {
          expect(jest.mocked(terminateProcess).mock.calls).toEqual([
            [lastProcess(mockOrcaExecutable), "Orca"],
            [null, "Orca debug log"],
            [lastProcess("speech-dispatcher"), "Speech Dispatcher"],
            [lastProcess(AT_SPI_LAUNCHER), "AT-SPI"],
            [lastProcess("dbus-daemon"), "session D-Bus"],
            [lastProcess("Xvfb"), "X Server"],
          ]);
        });

        it("should signal the AT-SPI process group", () => {
          expect(processKillSpy).toHaveBeenCalledWith(
            -lastProcess(AT_SPI_LAUNCHER).pid,
            "SIGTERM",
          );
        });

        it("should remove the runtime directory", () => {
          expect(rmSync).toHaveBeenCalledWith(mockRuntimeDirectory, {
            force: true,
            recursive: true,
          });
        });

        it("should close the session D-Bus connection", () => {
          expect(busStub.close).toHaveBeenCalled();
        });

        it("should close the AT-SPI bus connection", () => {
          expect(atSpiBusStub.close).toHaveBeenCalled();
        });

        it("should leave the client not running", () => {
          expect(() => client.service).toThrow(ERR_ORCA_NOT_RUNNING);
        });

        it("should allow the client to start again", async () => {
          await expect(start()).resolves.toBeUndefined();
        });
      });

      describe("when the AT-SPI process group is already gone", () => {
        it("should still stop", async () => {
          processKillSpy.mockImplementation(() => {
            throw new Error("test-error");
          });

          await expect(client.stop()).resolves.toBeUndefined();
        });
      });

      describe("when the AT-SPI launcher has no pid", () => {
        it("should not signal a process group", async () => {
          lastProcess(AT_SPI_LAUNCHER).pid = undefined;

          await client.stop();

          expect(processKillSpy).not.toHaveBeenCalled();
        });
      });

      describe("when disconnecting the speech socket throws", () => {
        it("should still stop", async () => {
          lastSocket().destroy.mockImplementation(() => {
            throw new Error("test-error");
          });

          await expect(client.stop()).resolves.toBeUndefined();
        });
      });

      describe("when stopping a process fails", () => {
        it("should reject with the error", async () => {
          const stubError = new Error("test-error");

          jest.mocked(terminateProcess).mockRejectedValueOnce(stubError);

          await expect(client.stop()).rejects.toBe(stubError);
        });
      });
    });
  });

  describe("speech socket messages", () => {
    beforeEach(async () => {
      await start();
    });

    it.each(["stop", "cancel"])("should emit cancel for %s", (type) => {
      const onCancel = jest.fn();

      client.on("cancel", onCancel);
      lastSocket().send(JSON.stringify({ type }));

      expect(onCancel).toHaveBeenCalled();
    });

    it("should ignore other message types", () => {
      const onAny = jest.fn();

      client.on("cancel", onAny);
      client.on("speech", onAny);
      client.on("ready", onAny);
      lastSocket().send(JSON.stringify({ type: "pause" }));

      expect(onAny).not.toHaveBeenCalled();
    });

    it("should emit cleaned speech", () => {
      const onSpeech = jest.fn();

      client.on("speech", onSpeech);
      speak("<speak>Get  Started.</speak>");

      expect(onSpeech).toHaveBeenCalledWith("Get Started.");
    });

    it("should handle messages split across chunks and blank or malformed lines", () => {
      const onSpeech = jest.fn();

      client.on("speech", onSpeech);

      const socket = lastSocket();

      socket.emit("data", '{"type":"speech",');
      socket.emit("data", '"data":"one"}\n\n   \nnot json\n{"type":"spe');
      socket.emit("data", 'ech","data":"two"}\n');

      expect(onSpeech.mock.calls).toEqual([["one"], ["two"]]);
    });

    it("should not reconnect after a socket error once connected", () => {
      lastSocket().emit("error", new Error("test-error"));

      expect(connect).toHaveBeenCalledTimes(1);
      expect(lastSocket().destroy).toHaveBeenCalled();
    });
  });

  describe("enqueueAndTap", () => {
    describe("when not started", () => {
      it("should throw", () => {
        expect(() => client.enqueueAndTap(jest.fn())).toThrow(
          ERR_ORCA_NOT_RUNNING,
        );
      });
    });

    describe("when started without a capture option", () => {
      beforeEach(async () => {
        await start();
      });

      it("should run the action without capturing speech", async () => {
        const stubResult = Symbol("test-result");
        const action = jest.fn(async () => {
          speak("ignored");

          return stubResult;
        });

        await expect(client.enqueueAndTap(action)).resolves.toEqual({
          itemText: "",
          result: stubResult,
          spokenPhrase: "",
        });
      });

      it("should reject with the action's error", async () => {
        const stubError = new Error("test-error");

        await expect(
          client.enqueueAndTap(() => Promise.reject(stubError)),
        ).rejects.toBe(stubError);
      });

      it("should run actions one at a time, in order", async () => {
        const order: string[] = [];
        let finishFirst: () => void;

        const first = client.enqueueAndTap(async () => {
          order.push("first started");

          await new Promise<void>((resolve) => {
            finishFirst = resolve;
          });

          order.push("first finished");
        });
        const second = client.enqueueAndTap(async () => {
          order.push("second started");
        });

        await Promise.resolve();

        expect(order).toEqual(["first started"]);

        finishFirst();

        await Promise.all([first, second]);

        expect(order).toEqual([
          "first started",
          "first finished",
          "second started",
        ]);
      });

      it("should record an entry in the spoken phrase log for each action", async () => {
        await client.enqueueAndTap(jest.fn());

        await expect(client.spokenPhraseLog()).resolves.toEqual([""]);
      });
    });

    describe("when started with capture: 'initial'", () => {
      beforeEach(async () => {
        await start({ capture: "initial" });
      });

      it("should capture only the first utterance", async () => {
        const output = client.enqueueAndTap(async () => {
          speak("first");
          speak("second");
        });

        await expect(output).resolves.toEqual(
          expect.objectContaining({ spokenPhrase: "first" }),
        );
      });

      it("should capture the first utterance after the action", async () => {
        const output = client.enqueueAndTap(jest.fn());

        await Promise.resolve();
        speak("later");

        await expect(output).resolves.toEqual(
          expect.objectContaining({ spokenPhrase: "later" }),
        );
      });

      it("should resolve empty if nothing is spoken within 1 second", async () => {
        const output = client.enqueueAndTap(jest.fn());

        await jest.advanceTimersByTimeAsync(1_000);

        await expect(output).resolves.toEqual(
          expect.objectContaining({ spokenPhrase: "" }),
        );
      });

      it("should let the action's options override it", async () => {
        const output = client.enqueueAndTap(
          async () => {
            speak("ignored");
          },
          { capture: false },
        );

        await expect(output).resolves.toEqual(
          expect.objectContaining({ spokenPhrase: "" }),
        );
      });
    });

    describe("with capture: true", () => {
      beforeEach(async () => {
        await start();
      });

      it("should capture speech until 1 second of quiet", async () => {
        let settled = false;

        const output = client.enqueueAndTap(
          async () => {
            speak("during");
          },
          { capture: true },
        );

        output.then(() => (settled = true));

        await jest.advanceTimersByTimeAsync(900);
        speak("after");
        await jest.advanceTimersByTimeAsync(900);
        speak("later");
        await jest.advanceTimersByTimeAsync(999);

        expect(settled).toBe(false);

        await jest.advanceTimersByTimeAsync(1);

        await expect(output).resolves.toEqual({
          itemText: "during. after. later",
          result: undefined,
          spokenPhrase: "during. after. later",
        });
      });

      it("should not capture speech after the action resolves", async () => {
        const output = client.enqueueAndTap(jest.fn(), { capture: true });

        await jest.advanceTimersByTimeAsync(1_000);
        await output;

        speak("too late");

        await expect(client.spokenPhraseLog()).resolves.toEqual([""]);
      });
    });

    describe("when stopped with actions still queued", () => {
      let first: Promise<unknown>;
      let second: Promise<unknown>;

      beforeEach(async () => {
        await start();

        first = client.enqueueAndTap(jest.fn(), { capture: true });
        second = client.enqueueAndTap(jest.fn());
        second.catch(() => {});

        const stopPromise = client.stop();

        await jest.advanceTimersByTimeAsync(1_000);
        await stopPromise;
      });

      it("should finish the action in flight", async () => {
        await expect(first).resolves.toEqual(
          expect.objectContaining({ spokenPhrase: "" }),
        );
      });

      it("should reject the actions not yet started", async () => {
        await expect(second).rejects.toThrow(ERR_ORCA_NOT_RUNNING);
      });
    });

    describe("when stopping", () => {
      it("should throw", async () => {
        await start();

        const stopPromise = client.stop();

        expect(() => client.enqueueAndTap(jest.fn())).toThrow(
          ERR_ORCA_NOT_RUNNING,
        );

        await stopPromise;
      });
    });
  });

  describe("generateKeyboardEvent", () => {
    describe("when not started", () => {
      it("should throw", async () => {
        await expect(client.generateKeyboardEvent(1, "", 3)).rejects.toThrow(
          ERR_ORCA_NOT_RUNNING,
        );
      });
    });

    describe("when started", () => {
      beforeEach(async () => {
        await start();
      });

      it("should generate the keyboard event with the device event controller", async () => {
        await client.generateKeyboardEvent(0, "test-text", 4);

        expect(
          deviceEventControllerStub.GenerateKeyboardEvent,
        ).toHaveBeenCalledWith(0, "test-text", 4);
      });
    });

    describe("when stopping", () => {
      it("should throw", async () => {
        await start();

        const stopPromise = client.stop();

        await expect(client.generateKeyboardEvent(1, "", 3)).rejects.toThrow(
          ERR_ORCA_NOT_RUNNING,
        );

        await stopPromise;
      });
    });
  });

  describe("spokenPhraseLog", () => {
    beforeEach(async () => {
      await start({ capture: "initial" });
    });

    it("should wait for queued actions and return every captured phrase", async () => {
      client.enqueueAndTap(async () => speak("one"));
      client.enqueueAndTap(async () => speak("two"));

      await expect(client.spokenPhraseLog()).resolves.toEqual(["one", "two"]);
    });
  });

  describe("clearSpokenPhraseLog", () => {
    beforeEach(async () => {
      await start({ capture: "initial" });
    });

    it("should wait for queued actions, then clear the log", async () => {
      client.enqueueAndTap(async () => speak("one"));

      await client.clearSpokenPhraseLog();

      await expect(client.spokenPhraseLog()).resolves.toEqual([]);
    });
  });
});
