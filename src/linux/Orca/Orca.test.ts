import { addTeardownHandler, removeTeardownHandler } from "../../teardown";
import {
  ERR_ORCA_ALREADY_RUNNING,
  ERR_ORCA_CANNOT_BE_STARTED,
  ERR_ORCA_NOT_INSTALLED,
  ERR_ORCA_NOT_RUNNING,
  ERR_ORCA_NOT_SUPPORTED,
} from "../errors";
import {
  getSetting,
  getSettings,
  loadGuidepupSettings,
  resetGuidepupSettings,
  setSettings,
} from "./settings";
import {
  navigateUntil,
  NavigateUntilMethod,
  NavigationMethod,
} from "../../navigateUntil";
import { delay } from "../../delay";
import { isLinux } from "../isLinux";
import { isOrcaInstalled } from "./isOrcaInstalled";
import { keyCodeCommands } from "./keyCodeCommands";
import { Orca } from "./Orca";
import { OrcaClient } from "./OrcaClient";

jest.mock("../../../manifest.json", () => ({
  screenReaders: [
    {
      id: "nvda",
      assets: [{ version: "test-nvda-version" }],
    },
    {
      id: "orca",
      assets: [{ version: "test-version" }],
    },
  ],
}));
jest.mock("../../teardown", () => ({
  addTeardownHandler: jest.fn(),
  removeTeardownHandler: jest.fn(),
}));
jest.mock("./settings", () => ({
  getSetting: jest.fn(),
  getSettings: jest.fn(),
  loadGuidepupSettings: jest.fn(),
  resetGuidepupSettings: jest.fn(),
  setSettings: jest.fn(),
}));
jest.mock("../isLinux", () => ({
  isLinux: jest.fn(),
}));
jest.mock("./isOrcaInstalled", () => ({
  isOrcaInstalled: jest.fn(),
}));
jest.mock("./OrcaClient", () => ({
  OrcaClient: jest.fn(),
}));
jest.mock("../../navigateUntil", () => ({
  navigateUntil: jest.fn(),
}));

const command = () => ({ execute: jest.fn() });

const serviceStub = {
  CaretNavigator: {
    commands: {
      ToggleEnabled: command(),
    },
  },
  FlatReviewPresenter: {
    commands: {
      LeftClickOnObject: command(),
      RightClickOnObject: command(),
    },
  },
  MousePresenter: {
    commands: {
      ToggleMouseReview: command(),
    },
  },
  ObjectNavigator: {
    commands: {
      MoveToFirstChild: command(),
      MoveToNextSibling: command(),
      MoveToParent: command(),
      MoveToPreviousSibling: command(),
      PerformAction: command(),
    },
  },
  StructuralNavigator: {
    commands: {
      NextHeading: command(),
      NextLandmark: command(),
      NextLink: command(),
      PreviousHeading: command(),
      PreviousLandmark: command(),
      PreviousLink: command(),
    },
  },
  TableNavigator: {
    commands: {
      ToggleEnabled: command(),
    },
  },
};

const OrcaClientStub = {
  start: jest.fn(),
  stop: jest.fn(),
  enqueueAndTap: jest.fn(),
  generateKeyboardEvent: jest.fn(),
  spokenPhraseLog: jest.fn(),
  clearSpokenPhraseLog: jest.fn(),
  service: serviceStub,
};

const captureOptions = { capture: true } as const;

/**
 * AT-SPI `KeySynthType` values.
 */
const SYM = 3;
const STRING = 4;
const LOCKMODIFIERS = 5;
const UNLOCKMODIFIERS = 6;

/**
 * Runs the action passed to the most recent `enqueueAndTap` call.
 */
const runEnqueuedAction = async () =>
  await jest.mocked(OrcaClientStub.enqueueAndTap).mock.calls.at(-1)![0]();

const getTeardownHandler = () =>
  jest.mocked(addTeardownHandler).mock.calls.at(-1)![0];

describe("Orca", () => {
  let orca: Orca;

  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(isLinux).mockReturnValue(true);
    jest.mocked(isOrcaInstalled).mockReturnValue(true);
    jest.mocked(OrcaClientStub.start).mockResolvedValue(undefined);
    jest.mocked(OrcaClientStub.stop).mockResolvedValue(undefined);
    jest
      .mocked(OrcaClient)
      .mockImplementation(() => OrcaClientStub as unknown as OrcaClient);

    orca = new Orca();
  });

  describe("name", () => {
    it("should return Orca", () => {
      expect(orca.name).toBe("Orca");
    });
  });

  describe("version", () => {
    it("should return the Orca asset version from the manifest", () => {
      expect(orca.version).toBe("test-version");
    });
  });

  describe("keyboardCommands", () => {
    it("should return the Orca keyboard commands", () => {
      expect(orca.keyboardCommands).toBe(keyCodeCommands);
    });
  });

  describe.each(["detect", "default"] as const)("%s", (method) => {
    describe.each`
      linux    | expected
      ${true}  | ${true}
      ${false} | ${false}
    `("when isLinux() is $linux", ({ linux, expected }) => {
      beforeEach(() => {
        jest.mocked(isLinux).mockReturnValue(linux);
      });

      it(`should return ${expected} from the static method`, () => {
        expect(Orca[method]()).toBe(expected);
      });

      it(`should return ${expected} from the instance method`, () => {
        expect(orca[method]()).toBe(expected);
      });
    });
  });

  describe("start", () => {
    describe("when not on Linux", () => {
      beforeEach(() => {
        jest.mocked(isLinux).mockReturnValue(false);
      });

      it("should throw an error", async () => {
        await expect(orca.start()).rejects.toThrow(ERR_ORCA_NOT_SUPPORTED);
      });
    });

    describe("when Orca is not installed", () => {
      beforeEach(() => {
        jest.mocked(isOrcaInstalled).mockReturnValue(false);
      });

      it("should throw an error", async () => {
        await expect(orca.start()).rejects.toThrow(ERR_ORCA_NOT_INSTALLED);
      });
    });

    describe("when Orca is not already running", () => {
      beforeEach(async () => {
        await orca.start(captureOptions);
      });

      it("should register a teardown handler", () => {
        expect(addTeardownHandler).toHaveBeenCalledWith(expect.any(Function));
      });

      it("should load the guidepup settings", () => {
        expect(loadGuidepupSettings).toHaveBeenCalled();
      });

      it("should not set any settings", () => {
        expect(setSettings).not.toHaveBeenCalled();
      });

      it("should start the client with the options", () => {
        expect(OrcaClientStub.start).toHaveBeenCalledWith(captureOptions);
      });
    });

    describe("when settings are provided", () => {
      const settings = { "test-key": Symbol("test-value") };

      beforeEach(async () => {
        await orca.start({ settings });
      });

      it("should set the settings after loading the guidepup settings", () => {
        expect(setSettings).toHaveBeenCalledWith(settings);
        expect(
          jest.mocked(loadGuidepupSettings).mock.invocationCallOrder[0],
        ).toBeLessThan(jest.mocked(setSettings).mock.invocationCallOrder[0]);
      });
    });

    describe("when Orca is already running", () => {
      beforeEach(async () => {
        await orca.start();
      });

      it("should throw an error", async () => {
        await expect(orca.start()).rejects.toThrow(ERR_ORCA_ALREADY_RUNNING);
      });
    });

    describe("when Orca is already starting", () => {
      let startPromise: Promise<void>;

      beforeEach(() => {
        jest
          .mocked(OrcaClientStub.start)
          .mockReturnValue(new Promise(() => {}));

        startPromise = orca.start();
      });

      afterEach(() => {
        startPromise.catch(() => {});
      });

      it("should throw an error", async () => {
        await expect(orca.start()).rejects.toThrow(ERR_ORCA_ALREADY_RUNNING);
      });
    });

    describe.each`
      step                     | fail
      ${"loading the settings"} | ${(e: Error) =>
  jest.mocked(loadGuidepupSettings).mockImplementation(() => {
    throw e;
  })}
      ${"starting the client"} | ${(e: Error) => jest.mocked(OrcaClientStub.start).mockRejectedValue(e)}
    `("when $step fails", ({ fail }) => {
      const stubError = new Error("test-error");

      let error: Error;

      beforeEach(async () => {
        fail(stubError);

        try {
          await orca.start();
        } catch (e) {
          error = e as Error;
        }
      });

      it("should throw an error with the cause", () => {
        expect(error.message).toBe(ERR_ORCA_CANNOT_BE_STARTED);
        expect(error.cause).toBe(stubError);
      });

      it("should tear down", () => {
        expect(removeTeardownHandler).toHaveBeenCalledWith(
          getTeardownHandler(),
        );
        expect(resetGuidepupSettings).toHaveBeenCalled();
      });

      it("should allow Orca to be started again", async () => {
        jest.mocked(loadGuidepupSettings).mockReset();
        jest.mocked(OrcaClientStub.start).mockResolvedValue(undefined);

        await expect(orca.start()).resolves.toBeUndefined();
      });
    });

    describe("when the client fails to start", () => {
      beforeEach(async () => {
        jest
          .mocked(OrcaClientStub.start)
          .mockRejectedValue(new Error("test-error"));

        await orca.start().catch(() => {});
      });

      it("should stop the client", () => {
        expect(OrcaClientStub.stop).toHaveBeenCalled();
      });
    });
  });

  describe("teardown on process termination", () => {
    let handler: () => Promise<void>;

    beforeEach(async () => {
      await orca.start();

      handler = getTeardownHandler();

      jest.clearAllMocks();
    });

    describe("when stopping succeeds", () => {
      beforeEach(async () => {
        await handler();
      });

      it("should deregister itself", () => {
        expect(removeTeardownHandler).toHaveBeenCalledWith(handler);
      });

      it("should stop the client", () => {
        expect(OrcaClientStub.stop).toHaveBeenCalled();
      });

      it("should reset the guidepup settings", () => {
        expect(resetGuidepupSettings).toHaveBeenCalled();
      });

      it("should leave Orca not running", async () => {
        await expect(orca.next()).rejects.toThrow(ERR_ORCA_NOT_RUNNING);
      });
    });

    describe("when stopping the client and resetting the settings fail", () => {
      beforeEach(() => {
        jest
          .mocked(OrcaClientStub.stop)
          .mockRejectedValue(new Error("test-stop-error"));
        jest.mocked(resetGuidepupSettings).mockImplementation(() => {
          throw new Error("test-reset-error");
        });
      });

      afterEach(() => {
        jest.mocked(resetGuidepupSettings).mockReset();
      });

      it("should not throw", async () => {
        await expect(handler()).resolves.toBeUndefined();
      });

      it("should still try to reset the guidepup settings", async () => {
        await handler();

        expect(resetGuidepupSettings).toHaveBeenCalled();
      });

      it("should allow Orca to be started again", async () => {
        await handler();

        jest.mocked(resetGuidepupSettings).mockReset();

        await expect(orca.start()).resolves.toBeUndefined();
      });
    });
  });

  describe("stop", () => {
    describe("when Orca is not running", () => {
      it("should throw an error", async () => {
        await expect(orca.stop()).rejects.toThrow(ERR_ORCA_NOT_RUNNING);
      });
    });

    describe("when Orca is running", () => {
      let handler: () => Promise<void>;

      beforeEach(async () => {
        await orca.start();

        handler = getTeardownHandler();

        jest.clearAllMocks();

        await orca.stop();
      });

      it("should stop the client", () => {
        expect(OrcaClientStub.stop).toHaveBeenCalled();
      });

      it("should reset the guidepup settings", () => {
        expect(resetGuidepupSettings).toHaveBeenCalled();
      });

      it("should deregister the teardown handler", () => {
        expect(removeTeardownHandler).toHaveBeenCalledWith(handler);
      });

      it("should leave Orca not running", async () => {
        await expect(orca.stop()).rejects.toThrow(ERR_ORCA_NOT_RUNNING);
      });
    });

    describe("when stopping the client fails", () => {
      const stubError = new Error("test-error");

      let error: unknown;

      beforeEach(async () => {
        await orca.start();

        jest.clearAllMocks();

        jest.mocked(OrcaClientStub.stop).mockRejectedValueOnce(stubError);

        try {
          await orca.stop();
        } catch (e) {
          error = e;
        }
      });

      it("should throw the error", () => {
        expect(error).toBe(stubError);
      });

      it("should allow stop to be retried", async () => {
        await expect(orca.stop()).resolves.toBeUndefined();

        expect(OrcaClientStub.stop).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe.each`
    method                | service                  | command
    ${"previous"}         | ${"ObjectNavigator"}     | ${"MoveToPreviousSibling"}
    ${"next"}             | ${"ObjectNavigator"}     | ${"MoveToNextSibling"}
    ${"previousHeading"}  | ${"StructuralNavigator"} | ${"PreviousHeading"}
    ${"nextHeading"}      | ${"StructuralNavigator"} | ${"NextHeading"}
    ${"previousLink"}     | ${"StructuralNavigator"} | ${"PreviousLink"}
    ${"nextLink"}         | ${"StructuralNavigator"} | ${"NextLink"}
    ${"previousLandmark"} | ${"StructuralNavigator"} | ${"PreviousLandmark"}
    ${"nextLandmark"}     | ${"StructuralNavigator"} | ${"NextLandmark"}
    ${"act"}              | ${"ObjectNavigator"}     | ${"PerformAction"}
    ${"interact"}         | ${"ObjectNavigator"}     | ${"MoveToFirstChild"}
    ${"stopInteracting"}  | ${"ObjectNavigator"}     | ${"MoveToParent"}
  `("$method", ({ method, service, command }) => {
    describe("when Orca is not running", () => {
      it("should throw an error", async () => {
        await expect(orca[method]()).rejects.toThrow(ERR_ORCA_NOT_RUNNING);
      });
    });

    describe("when Orca is running", () => {
      beforeEach(async () => {
        await orca.start();

        jest.clearAllMocks();

        await orca[method](captureOptions);
      });

      it("should enqueue an action with the options", () => {
        expect(OrcaClientStub.enqueueAndTap).toHaveBeenCalledWith(
          expect.any(Function),
          captureOptions,
        );
      });

      it(`should execute the ${service} ${command} command in the action`, async () => {
        expect(
          serviceStub[service].commands[command].execute,
        ).not.toHaveBeenCalled();

        await runEnqueuedAction();

        expect(
          serviceStub[service].commands[command].execute,
        ).toHaveBeenCalled();
      });
    });
  });

  describe.each`
    method                             | navigationMethod
    ${"navigatePreviousUntil"}         | ${"previous"}
    ${"navigateNextUntil"}             | ${"next"}
    ${"navigatePreviousHeadingUntil"}  | ${"previousHeading"}
    ${"navigateNextHeadingUntil"}      | ${"nextHeading"}
    ${"navigatePreviousLinkUntil"}     | ${"previousLink"}
    ${"navigateNextLinkUntil"}         | ${"nextLink"}
    ${"navigatePreviousLandmarkUntil"} | ${"previousLandmark"}
    ${"navigateNextLandmarkUntil"}     | ${"nextLandmark"}
  `(
    "$method",
    ({
      method,
      navigationMethod,
    }: {
      method: NavigateUntilMethod;
      navigationMethod: NavigationMethod;
    }) => {
      const spokenPhraseMatcher = "test-spoken-phrase";
      const options = { maxNavigationAttempts: 3 };

      beforeEach(async () => {
        await orca[method](spokenPhraseMatcher, options);
      });

      it(`should navigate using ${navigationMethod} until the spoken phrase matches`, () => {
        expect(navigateUntil).toHaveBeenCalledWith(
          orca,
          navigationMethod,
          spokenPhraseMatcher,
          options,
        );
      });
    },
  );

  describe("press", () => {
    describe("when Orca is not running", () => {
      it("should throw an error", async () => {
        await expect(orca.press("Tab")).rejects.toThrow(ERR_ORCA_NOT_RUNNING);
      });
    });

    describe("when Orca is running", () => {
      beforeEach(async () => {
        await orca.start();

        jest.clearAllMocks();
      });

      it("should enqueue an action with the options", async () => {
        await orca.press("Tab", captureOptions);

        expect(OrcaClientStub.enqueueAndTap).toHaveBeenCalledWith(
          expect.any(Function),
          captureOptions,
        );
      });

      it("should generate the key in the action", async () => {
        await orca.press("Tab");

        expect(OrcaClientStub.generateKeyboardEvent).not.toHaveBeenCalled();

        await runEnqueuedAction();

        expect(OrcaClientStub.generateKeyboardEvent.mock.calls).toEqual([
          [0xff09, "", SYM],
        ]);
      });

      describe.each`
        key                  | mask
        ${"Control+f"}       | ${4}
        ${"Control+Shift+f"} | ${5}
        ${"F"}               | ${1}
      `("when the key is $key", ({ key, mask }) => {
        it("should hold the modifiers around the key in the action", async () => {
          await orca.press(key);
          await runEnqueuedAction();

          expect(OrcaClientStub.generateKeyboardEvent.mock.calls).toEqual([
            [mask, "", LOCKMODIFIERS],
            [0x66, "", SYM],
            [mask, "", UNLOCKMODIFIERS],
          ]);
        });
      });

      describe("when generating the key fails", () => {
        it("should release the modifiers and throw from the action", async () => {
          const stubError = new Error("test-error");

          OrcaClientStub.generateKeyboardEvent
            .mockResolvedValueOnce(undefined)
            .mockRejectedValueOnce(stubError);

          await orca.press("Control+f");

          await expect(runEnqueuedAction()).rejects.toBe(stubError);
          expect(OrcaClientStub.generateKeyboardEvent).toHaveBeenLastCalledWith(
            4,
            "",
            UNLOCKMODIFIERS,
          );
        });
      });
    });
  });

  describe("type", () => {
    describe("when Orca is not running", () => {
      it("should throw an error", async () => {
        await expect(orca.type("test-text")).rejects.toThrow(
          ERR_ORCA_NOT_RUNNING,
        );
      });
    });

    describe("when Orca is running", () => {
      beforeEach(async () => {
        await orca.start();

        jest.clearAllMocks();

        await orca.type("test-text", captureOptions);
      });

      it("should enqueue an action with the options", () => {
        expect(OrcaClientStub.enqueueAndTap).toHaveBeenCalledWith(
          expect.any(Function),
          captureOptions,
        );
      });

      it("should generate the text in the action", async () => {
        expect(OrcaClientStub.generateKeyboardEvent).not.toHaveBeenCalled();

        await runEnqueuedAction();

        expect(OrcaClientStub.generateKeyboardEvent.mock.calls).toEqual([
          [0, "test-text", STRING],
        ]);
      });
    });
  });

  describe("perform", () => {
    describe("when Orca is not running", () => {
      it("should throw an error", async () => {
        await expect(
          orca.perform(keyCodeCommands.StructuralNavigator.NextHeading),
        ).rejects.toThrow(ERR_ORCA_NOT_RUNNING);
      });
    });

    describe("when Orca is running", () => {
      beforeEach(async () => {
        await orca.start();

        jest.clearAllMocks();
      });

      it("should enqueue an action with the options", async () => {
        await orca.perform(
          keyCodeCommands.StructuralNavigator.NextHeading,
          captureOptions,
        );

        expect(OrcaClientStub.enqueueAndTap).toHaveBeenCalledWith(
          expect.any(Function),
          captureOptions,
        );
      });

      it("should execute the command in the action", async () => {
        await orca.perform(keyCodeCommands.StructuralNavigator.NextHeading);
        await runEnqueuedAction();

        expect(
          serviceStub.StructuralNavigator.commands.NextHeading.execute,
        ).toHaveBeenCalled();
      });

      it("should dispatch same-name commands to their respective services", async () => {
        await orca.perform(keyCodeCommands.CaretNavigator.ToggleEnabled);
        await runEnqueuedAction();

        await orca.perform(keyCodeCommands.TableNavigator.ToggleEnabled);
        await runEnqueuedAction();

        expect(
          serviceStub.CaretNavigator.commands.ToggleEnabled.execute,
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceStub.TableNavigator.commands.ToggleEnabled.execute,
        ).toHaveBeenCalledTimes(1);
      });

      describe("when the command is a MousePresenter command", () => {
        it("should execute the command in the action", async () => {
          await orca.perform(
            keyCodeCommands.MousePresenter.ToggleMouseReview,
          );
          await runEnqueuedAction();

          expect(
            serviceStub.MousePresenter.commands.ToggleMouseReview.execute,
          ).toHaveBeenCalled();
        });

        describe("when the MousePresenter module is not available", () => {
          const { MousePresenter } = serviceStub;

          beforeEach(() => {
            delete serviceStub.MousePresenter;
          });

          afterEach(() => {
            serviceStub.MousePresenter = MousePresenter;
          });

          it("should throw from the action", async () => {
            await orca.perform(
              keyCodeCommands.MousePresenter.ToggleMouseReview,
            );

            await expect(runEnqueuedAction()).rejects.toThrow(
              "Orca command module 'MousePresenter' is not available.",
            );
          });
        });
      });
    });
  });

  describe("click", () => {
    describe("when Orca is not running", () => {
      it("should throw an error", async () => {
        await expect(orca.click()).rejects.toThrow(ERR_ORCA_NOT_RUNNING);
      });
    });

    describe("when Orca is running", () => {
      const { LeftClickOnObject, RightClickOnObject } =
        serviceStub.FlatReviewPresenter.commands;

      beforeEach(async () => {
        await orca.start();

        jest.clearAllMocks();
      });

      describe.each`
        options                               | clickCommand          | count
        ${undefined}                          | ${LeftClickOnObject}  | ${1}
        ${{ button: "left" }}                 | ${LeftClickOnObject}  | ${1}
        ${{ button: "right" }}                | ${RightClickOnObject} | ${1}
        ${{ button: "right", clickCount: 2 }} | ${RightClickOnObject} | ${2}
        ${{ clickCount: 3 }}                  | ${LeftClickOnObject}  | ${3}
      `("with options $options", ({ options, clickCommand, count }) => {
        beforeEach(async () => {
          await orca.click(options);
        });

        it("should enqueue an action with the options", () => {
          expect(OrcaClientStub.enqueueAndTap).toHaveBeenCalledWith(
            expect.any(Function),
            options,
          );
        });

        it(`should click ${count} time(s) in the action`, async () => {
          await runEnqueuedAction();

          expect(clickCommand.execute).toHaveBeenCalledTimes(count);
        });
      });
    });
  });

  describe.each(["lastSpokenPhrase", "itemText"] as const)("%s", (method) => {
    describe("when Orca is not running", () => {
      it("should throw an error", async () => {
        await expect(orca[method]()).rejects.toThrow(ERR_ORCA_NOT_RUNNING);
      });
    });

    describe("when Orca is running", () => {
      beforeEach(async () => {
        await orca.start();
      });

      it("should return the last phrase in the spoken phrase log", async () => {
        const lastSpokenPhrase = Symbol("test-last-spoken-phrase");

        jest
          .mocked(OrcaClientStub.spokenPhraseLog)
          .mockResolvedValue([Symbol("test-spoken-phrase"), lastSpokenPhrase]);

        expect(await orca[method]()).toBe(lastSpokenPhrase);
      });

      it("should return an empty string when nothing has been spoken", async () => {
        jest.mocked(OrcaClientStub.spokenPhraseLog).mockResolvedValue([]);

        expect(await orca[method]()).toBe("");
      });
    });
  });

  describe.each(["spokenPhraseLog", "itemTextLog"] as const)("%s", (method) => {
    describe("when Orca is not running", () => {
      it("should throw an error", async () => {
        await expect(orca[method]()).rejects.toThrow(ERR_ORCA_NOT_RUNNING);
      });
    });

    describe("when Orca is running", () => {
      const log = Symbol("test-spoken-phrase-log");

      beforeEach(async () => {
        await orca.start();

        jest.mocked(OrcaClientStub.spokenPhraseLog).mockResolvedValue(log);
      });

      it("should return the client's spoken phrase log", async () => {
        expect(await orca[method]()).toBe(log);
      });
    });
  });

  describe.each(["clearSpokenPhraseLog", "clearItemTextLog"] as const)(
    "%s",
    (method) => {
      describe("when Orca is not running", () => {
        it("should throw an error", async () => {
          await expect(orca[method]()).rejects.toThrow(ERR_ORCA_NOT_RUNNING);
        });
      });

      describe("when Orca is running", () => {
        beforeEach(async () => {
          await orca.start();

          await orca[method]();
        });

        it("should clear the client's spoken phrase log", () => {
          expect(OrcaClientStub.clearSpokenPhraseLog).toHaveBeenCalled();
        });
      });
    },
  );

  describe("getSettings", () => {
    it("should return the settings", () => {
      const settings = { "test-key": Symbol("test-value") };

      jest.mocked(getSettings).mockReturnValue(settings);

      expect(orca.getSettings()).toBe(settings);
    });
  });

  describe("getSetting", () => {
    it("should return the setting", () => {
      const value = Symbol("test-value");

      jest.mocked(getSetting).mockReturnValue(value);

      expect(orca.getSetting("test-key")).toBe(value);
      expect(getSetting).toHaveBeenCalledWith("test-key");
    });
  });

  describe("capture", () => {
    const actionStub = jest.fn();
    const outputStub = {
      itemText: "test-item-text",
      result: "test-result",
      spokenPhrase: "test-spoken-phrase",
    };

    describe("when Orca is not running", () => {
      it("should throw an error", async () => {
        await expect(orca.capture(actionStub)).rejects.toThrow(
          ERR_ORCA_NOT_RUNNING,
        );
      });
    });

    describe("when Orca is running", () => {
      let output: unknown;

      beforeEach(async () => {
        jest.mocked(OrcaClientStub.enqueueAndTap).mockResolvedValue(outputStub);

        await orca.start();

        jest.clearAllMocks();

        output = await orca.capture(actionStub, captureOptions);
      });

      it("should enqueue and tap an async wrapper of the provided action", async () => {
        expect(OrcaClientStub.enqueueAndTap).toHaveBeenCalledWith(
          expect.any(Function),
          captureOptions,
        );

        expect(actionStub).not.toHaveBeenCalled();

        await runEnqueuedAction();

        expect(actionStub).toHaveBeenCalled();
      });

      it("should return the result of the action, item text, and spoken phrase", () => {
        expect(output).toBe(outputStub);
      });
    });
  });

  describe("when stop is in progress", () => {
    let stopPromise: Promise<void>;
    let finishStopping: () => void;

    beforeEach(async () => {
      await orca.start();

      jest.mocked(OrcaClientStub.stop).mockReturnValue(
        new Promise<void>((resolve) => {
          finishStopping = resolve;
        }),
      );

      stopPromise = orca.stop();

      await delay(0);
    });

    afterEach(async () => {
      finishStopping();

      await stopPromise;
    });

    it.each([
      "previous",
      "next",
      "previousHeading",
      "nextHeading",
      "previousLink",
      "nextLink",
      "previousLandmark",
      "nextLandmark",
      "act",
      "interact",
      "stopInteracting",
      "click",
      "lastSpokenPhrase",
      "itemText",
      "spokenPhraseLog",
      "clearSpokenPhraseLog",
      "itemTextLog",
      "clearItemTextLog",
    ] as const)("should throw when calling %s", async (method) => {
      await expect(orca[method]()).rejects.toThrow(ERR_ORCA_NOT_RUNNING);
    });

    it("should throw when calling press", async () => {
      await expect(orca.press("Tab")).rejects.toThrow(ERR_ORCA_NOT_RUNNING);
    });

    it("should throw when calling type", async () => {
      await expect(orca.type("test-text")).rejects.toThrow(
        ERR_ORCA_NOT_RUNNING,
      );
    });

    it("should throw when calling perform", async () => {
      await expect(
        orca.perform(keyCodeCommands.StructuralNavigator.NextHeading),
      ).rejects.toThrow(ERR_ORCA_NOT_RUNNING);
    });

    it("should throw when calling capture", async () => {
      await expect(orca.capture(jest.fn())).rejects.toThrow(
        ERR_ORCA_NOT_RUNNING,
      );
    });
  });
});
