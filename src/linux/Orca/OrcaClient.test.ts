import {
  ERR_ORCA_CANNOT_BE_STARTED,
  ERR_ORCA_NOT_RUNNING,
  ERR_ORCA_SPEECHD_CANNOT_CONNECT,
} from "../errors";
import { type MessageBus, UnknownInterfaceError } from "dbus-native";
import { mkdtempSync, rmSync } from "node:fs";
import type { ChildProcess } from "node:child_process";
import { connect } from "node:net";
import { connectAtSpiDeviceEventController } from "./connectAtSpiDeviceEventController";
import EventEmitter from "node:events";
import { OrcaClient } from "./OrcaClient";
import { startAtSpi } from "./startAtSpi";
import { startOrca } from "./startOrca";
import { startSessionDBus } from "./startSessionDBus";
import { startSpeechDispatcher } from "./startSpeechDispatcher";
import { startXServer } from "./startXServer";
import { terminateAtSpi } from "./terminateAtSpi";
import { terminateProcess } from "./terminateProcess";

jest.mock("node:fs", () => ({
  mkdirSync: jest.fn(),
  mkdtempSync: jest.fn(),
  rmSync: jest.fn(),
}));
jest.mock("node:net", () => ({
  connect: jest.fn(),
}));
jest.mock("dbus-native", () => {
  class UnknownInterfaceError extends Error {}

  return { UnknownInterfaceError };
});
jest.mock("../../debug", () => {
  const debug = jest.fn();

  return { base: { extend: () => debug } };
});
jest.mock("./connectAtSpiDeviceEventController", () => ({
  connectAtSpiDeviceEventController: jest.fn(),
}));
jest.mock("./startAtSpi", () => ({
  startAtSpi: jest.fn(),
}));
jest.mock("./terminateAtSpi", () => ({
  terminateAtSpi: jest.fn(),
}));
jest.mock("./terminateProcess", () => ({
  terminateProcess: jest.fn(),
}));
jest.mock("./startOrca", () => ({
  startOrca: jest.fn(),
}));
jest.mock("./startSessionDBus", () => ({
  startSessionDBus: jest.fn(),
}));
jest.mock("./startSpeechDispatcher", () => ({
  startSpeechDispatcher: jest.fn(),
}));
jest.mock("./startXServer", () => ({
  startXServer: jest.fn(),
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

const mockDisplay = "test-display";
const mockDBusAddress = "test-dbus-address";
const mockRuntimeDirectory = "test-runtime-directory";
const mockSpeechdAddress = "test-speechd-address";
const mockGuidepupSocketPath = "test-guidepup-socket-path";
const ORCA_SERVICE = "org.gnome.Orca1.Service";

const fakeProcess = (name: string) => ({ name }) as unknown as ChildProcess;

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
  let sockets: FakeSocket[];
  let socketBehaviours: SocketBehaviour[];
  let interfaces: Record<string, ReturnType<typeof interfaceStub>>;
  let busStub: {
    close: jest.Mock;
    getService: jest.Mock;
  };
  let orcaServiceStub: { getInterface: jest.Mock };
  let deviceEventControllerStub: { GenerateKeyboardEvent: jest.Mock };
  let atSpiBusStub: { close: jest.Mock };
  let atSpiProcess: ChildProcess;
  let orcaProcess: ChildProcess;
  let speechdProcess: ChildProcess;
  let stopped: [unknown, string][];
  let xvfbProcess: ChildProcess;
  let dbusProcess: ChildProcess;

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

    sockets = [];
    socketBehaviours = [];
    interfaces = {
      MousePresenter: interfaceStub(),
      ObjectNavigator: interfaceStub(),
      SpeechPresenter: interfaceStub(),
    };

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

    orcaServiceStub = {
      getInterface: jest.fn(async (_objectPath: string, name: string) => {
        return interfaces[name.replace("org.gnome.Orca1.", "")];
      }),
    };

    deviceEventControllerStub = {
      GenerateKeyboardEvent: jest.fn().mockResolvedValue(undefined),
    };

    atSpiBusStub = {
      close: jest.fn().mockResolvedValue(undefined),
    };

    busStub = {
      close: jest.fn().mockResolvedValue(undefined),
      getService: jest.fn().mockReturnValue(orcaServiceStub),
    };

    jest.mocked(mkdtempSync).mockReturnValue(mockRuntimeDirectory);
    xvfbProcess = fakeProcess("xvfb");
    dbusProcess = fakeProcess("dbus");

    jest.mocked(startXServer).mockResolvedValue({
      display: mockDisplay,
      process: xvfbProcess,
    });
    jest.mocked(startSessionDBus).mockResolvedValue({
      address: mockDBusAddress,
      bus: busStub as unknown as MessageBus,
      process: dbusProcess,
    });
    speechdProcess = fakeProcess("speechd");

    jest.mocked(startSpeechDispatcher).mockResolvedValue({
      address: mockSpeechdAddress,
      guidepupSocketPath: mockGuidepupSocketPath,
      process: speechdProcess,
    });

    atSpiProcess = fakeProcess("at-spi");

    jest.mocked(connectAtSpiDeviceEventController).mockResolvedValue({
      bus: atSpiBusStub as unknown as MessageBus,
      controller: deviceEventControllerStub,
    });

    jest.mocked(startAtSpi).mockResolvedValue(atSpiProcess);

    orcaProcess = fakeProcess("orca");

    jest.mocked(startOrca).mockResolvedValue({
      process: orcaProcess,
      debugLogProcess: null,
    });

    stopped = [];

    jest.mocked(terminateProcess).mockImplementation(async (child, name) => {
      stopped.push([child, name]);
    });
    jest.mocked(terminateAtSpi).mockImplementation(async (launcher) => {
      stopped.push([launcher, "AT-SPI"]);
    });

    client = new OrcaClient();
  });

  afterEach(() => {
    process.env = originalEnv;

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

      it("should start an X server", () => {
        expect(startXServer).toHaveBeenCalled();
      });

      it("should start a session D-Bus on the X server's display", () => {
        expect(startSessionDBus).toHaveBeenCalledWith(mockDisplay);
      });

      it("should start AT-SPI on the X server's display and the session D-Bus", () => {
        expect(startAtSpi).toHaveBeenCalledWith(
          mockDisplay,
          expect.objectContaining({ address: mockDBusAddress, bus: busStub }),
        );
      });

      it("should connect to the AT-SPI device event controller through the session D-Bus", () => {
        expect(connectAtSpiDeviceEventController).toHaveBeenCalledWith(busStub);
      });

      it("should start Speech Dispatcher in the runtime directory", () => {
        expect(startSpeechDispatcher).toHaveBeenCalledWith(
          mockRuntimeDirectory,
        );
      });

      it("should connect to the guidepup speech socket", () => {
        expect(connect).toHaveBeenCalledWith(
          mockGuidepupSocketPath,
          expect.any(Function),
        );
        expect(lastSocket().setEncoding).toHaveBeenCalledWith("utf8");
      });

      it("should start Orca with the session's display, D-Bus and Speech Dispatcher", () => {
        expect(startOrca).toHaveBeenCalledWith({
          display: mockDisplay,
          runtimeDirectory: mockRuntimeDirectory,
          sessionDBus: expect.objectContaining({ address: mockDBusAddress }),
          speechdAddress: mockSpeechdAddress,
        });
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

      describe("when started again", () => {
        beforeEach(async () => {
          jest.clearAllMocks();

          await start();
        });

        it("should do nothing", () => {
          expect(startXServer).not.toHaveBeenCalled();
        });
      });
    });

    describe("when already starting", () => {
      it("should do nothing", async () => {
        const first = client.start();
        const second = client.start();

        await jest.runAllTimersAsync();
        await Promise.all([first, second]);

        expect(startXServer).toHaveBeenCalledTimes(1);
      });
    });

    describe("Speech Dispatcher", () => {
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
        jest.mocked(startOrca).mockRejectedValueOnce(new Error("test-error"));

        error = await startError();
      });

      it("should throw a start error", () => {
        expect(error.message).toBe(ERR_ORCA_CANNOT_BE_STARTED);
      });

      it("should stop every process it started", () => {
        expect(stopped.map(([child]) => child)).toEqual(
          expect.arrayContaining([
            speechdProcess,
            atSpiProcess,
            dbusProcess,
            xvfbProcess,
          ]),
        );
      });

      it("should remove the runtime directory", () => {
        expect(rmSync).toHaveBeenCalledWith(mockRuntimeDirectory, {
          force: true,
          recursive: true,
        });
      });

      it("should allow a later start", async () => {
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
        stopped.forEach(([child]) => expect(child).toBeFalsy());
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
          expect(stopped).toEqual([
            [orcaProcess, "Orca"],
            [null, "Orca debug log"],
            [speechdProcess, "Speech Dispatcher"],
            [atSpiProcess, "AT-SPI"],
            [dbusProcess, "session D-Bus"],
            [xvfbProcess, "X Server"],
          ]);
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
