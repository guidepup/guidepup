import {
  ERR_MACOS_VERSION_NOT_SUPPORTED,
  ERR_VOICE_OVER_ALREADY_RUNNING,
  ERR_VOICE_OVER_CANNOT_BE_STARTED,
  ERR_VOICE_OVER_NOT_RUNNING,
  ERR_VOICE_OVER_NOT_SUPPORTED,
} from "../errors";
import {
  getPreference,
  getPreferences,
  mountGuidepupPreferences,
  setPreferences,
  unmountGuidepupPreferences,
} from "./preferences";
import { CommanderCommands } from "./CommanderCommands";
import { delay } from "../../delay";
import { isKeyboard } from "../../isKeyboard";
import { isMacOS } from "../isMacOS";
import { keyCodeCommands } from "./keyCodeCommands";
import { release } from "node:os";
import { start } from "./start";
import { terminateVoiceOverProcess } from "./terminateVoiceOverProcess";
import { VoiceOver } from "./VoiceOver";
import { VoiceOverCaption } from "./VoiceOverCaption";
import { VoiceOverClient } from "./VoiceOverClient";
import { VoiceOverCommander } from "./VoiceOverCommander";
import { VoiceOverCursor } from "./VoiceOverCursor";
import { VoiceOverKeyboard } from "./VoiceOverKeyboard";
import { VoiceOverMouse } from "./VoiceOverMouse";
import { waitForNotRunning } from "./waitForNotRunning";
import { waitForRunning } from "./waitForRunning";

jest.mock("../../../manifest.json", () => ({
  screenReaders: [
    {
      id: "voiceover",
      assets: [
        {
          version: "test-version",
          platformVersion: "123",
        },
      ],
    },
  ],
}));
jest.mock("node:os", () => ({
  release: jest.fn(),
}));
jest.mock("../activate", () => ({
  activate: jest.fn(),
}));
jest.mock("../../isKeyboard", () => ({
  isKeyboard: jest.fn(),
}));
jest.mock("../isMacOS", () => ({
  isMacOS: jest.fn(),
}));
jest.mock("./preferences", () => ({
  getPreference: jest.fn(),
  getPreferences: jest.fn(),
  mountGuidepupPreferences: jest.fn(),
  setPreferences: jest.fn(),
  unmountGuidepupPreferences: jest.fn(),
}));
jest.mock("./VoiceOverClient", () => ({
  VoiceOverClient: jest.fn(),
}));
jest.mock("./terminateVoiceOverProcess", () => ({
  terminateVoiceOverProcess: jest.fn(),
}));
jest.mock("./start", () => ({
  start: jest.fn(),
}));
jest.mock("./VoiceOverCaption", () => ({
  VoiceOverCaption: jest.fn(),
}));
jest.mock("./VoiceOverCommander", () => ({
  VoiceOverCommander: jest.fn(),
}));
jest.mock("./VoiceOverCursor", () => ({
  VoiceOverCursor: jest.fn(),
}));
jest.mock("./VoiceOverKeyboard", () => ({
  VoiceOverKeyboard: jest.fn(),
}));
jest.mock("./VoiceOverMouse", () => ({
  VoiceOverMouse: jest.fn(),
}));
jest.mock("./waitForNotRunning", () => ({
  waitForNotRunning: jest.fn(),
}));
jest.mock("./waitForRunning", () => ({
  waitForRunning: jest.fn(),
}));

const VoiceOverClientStub = {
  enqueueAndTap: jest.fn(),
  stop: jest.fn(),
};

const VoiceOverCaptionStub = {
  lastSpokenPhrase: jest.fn(),
  itemText: jest.fn(),
  spokenPhraseLog: jest.fn(),
  clearSpokenPhraseLog: jest.fn(),
  itemTextLog: jest.fn(),
  clearItemTextLog: jest.fn(),
  copyLastSpokenPhrase: jest.fn(),
  saveLastSpokenPhrase: jest.fn(),
};

const VoiceOverCommanderStub = {
  commands: Symbol("test-commander-commands"),
  perform: jest.fn(),
};

const VoiceOverCursorStub = {
  previous: jest.fn(),
  next: jest.fn(),
  act: jest.fn(),
  interact: jest.fn(),
  stopInteracting: jest.fn(),
  takeScreenshot: jest.fn(),
};

const VoiceOverKeyboardStub = {
  commands: Symbol("test-keyboard-commands"),
  press: jest.fn(),
  type: jest.fn(),
  perform: jest.fn(),
};

const VoiceOverMouseStub = {
  click: jest.fn(),
};

describe("VoiceOver", () => {
  let vo: VoiceOver;
  let result: unknown;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    (VoiceOverClient as jest.Mock<VoiceOverClient>).mockImplementation(
      () => VoiceOverClientStub as unknown as VoiceOverClient,
    );
    (VoiceOverCaption as jest.Mock<VoiceOverCaption>).mockImplementation(
      () => VoiceOverCaptionStub as unknown as VoiceOverCaption,
    );
    (VoiceOverCommander as jest.Mock<VoiceOverCommander>).mockImplementation(
      () => VoiceOverCommanderStub as unknown as VoiceOverCommander,
    );
    (VoiceOverCursor as jest.Mock<VoiceOverCursor>).mockImplementation(
      () => VoiceOverCursorStub as unknown as VoiceOverCursor,
    );
    (VoiceOverKeyboard as jest.Mock<VoiceOverKeyboard>).mockImplementation(
      () => VoiceOverKeyboardStub as unknown as VoiceOverKeyboard,
    );
    (VoiceOverMouse as jest.Mock<VoiceOverMouse>).mockImplementation(
      () => VoiceOverMouseStub as unknown as VoiceOverMouse,
    );

    jest.mocked(isMacOS).mockReturnValue(true);
    jest.mocked(getPreferences).mockReturnValue({});
    jest.mocked(getPreference).mockReturnValue(undefined);

    jest.mocked(release).mockReturnValue("123.0.0");

    vo = new VoiceOver();
    result = undefined;
  });

  describe("name", () => {
    it("should return VoiceOver", () => {
      expect(vo.name).toBe("VoiceOver");
    });
  });

  describe("version", () => {
    it("should return the VoiceOver version for supported versions of macOS", () => {
      expect(vo.version).toBe("test-version");
    });

    it("should throw an error for unsupported versions of macOS", () => {
      jest.clearAllMocks();
      jest.mocked(release).mockReturnValue("321.0.0");

      vo = new VoiceOver();

      expect(() => vo.version).toThrow(ERR_MACOS_VERSION_NOT_SUPPORTED);
    });
  });

  describe("detect (static)", () => {
    describe.each`
      macOS    | expected
      ${false} | ${false}
      ${true}  | ${true}
    `("when is macOS is $macOS", ({ macOS, expected }) => {
      beforeEach(() => {
        jest.mocked(isMacOS).mockReturnValue(macOS);

        result = VoiceOver.detect();
      });

      it(`should return ${expected}`, () => {
        expect(result).toBe(expected);
      });
    });
  });

  describe("detect", () => {
    describe.each`
      macOS    | expected
      ${false} | ${false}
      ${true}  | ${true}
    `("when is macOS is $macOS", ({ macOS, expected }) => {
      beforeEach(() => {
        jest.mocked(isMacOS).mockReturnValue(macOS);

        result = vo.detect();
      });

      it(`should return ${expected}`, () => {
        expect(result).toBe(expected);
      });
    });
  });

  describe("default (static)", () => {
    describe.each`
      macOS    | expected
      ${false} | ${false}
      ${true}  | ${true}
    `("when is macOS is $macOS", ({ macOS, expected }) => {
      beforeEach(() => {
        jest.mocked(isMacOS).mockReturnValue(macOS);

        result = VoiceOver.default();
      });

      it(`should return ${expected}`, () => {
        expect(result).toBe(expected);
      });
    });
  });

  describe("default", () => {
    describe.each`
      macOS    | expected
      ${false} | ${false}
      ${true}  | ${true}
    `("when is macOS is $macOS", ({ macOS, expected }) => {
      beforeEach(() => {
        jest.mocked(isMacOS).mockReturnValue(macOS);

        result = vo.default();
      });

      it(`should return ${expected}`, () => {
        expect(result).toBe(expected);
      });
    });
  });

  describe("start", () => {
    describe("when VoiceOver is not supported", () => {
      beforeEach(() => {
        jest.mocked(isMacOS).mockReturnValue(false);
      });

      it("should throw", async () => {
        await expect(vo.start.bind(vo)).rejects.toThrow(
          ERR_VOICE_OVER_NOT_SUPPORTED,
        );
      });
    });

    describe("when VoiceOver is supported", () => {
      describe("when VoiceOver is not running", () => {
        beforeEach(async () => {
          try {
            await vo.stop();
          } catch {
            // swallow
          }
        });

        test("should throw an error trying to access the keyboard commands getter", () => {
          expect(() => vo.keyboardCommands).toThrow(ERR_VOICE_OVER_NOT_RUNNING);
        });

        test("should throw an error trying to access the commander commands getter", () => {
          expect(() => vo.commanderCommands).toThrow(
            ERR_VOICE_OVER_NOT_RUNNING,
          );
        });
      });

      describe("when VoiceOver is already running", () => {
        beforeEach(async () => {
          await vo.start();
        });

        it("should throw an error when trying to start again", async () => {
          await expect(async () => await vo.start()).rejects.toThrow(
            ERR_VOICE_OVER_ALREADY_RUNNING,
          );
        });
      });

      describe.each`
        description               | options
        ${"without options"}      | ${undefined}
        ${"with options"}         | ${{}}
        ${"with capture options"} | ${{ capture: true }}
      `("when called $description", ({ options }) => {
        beforeEach(async () => {
          await vo.start(options);
        });

        it("should construct a VoiceOver Client instance", () => {
          expect(VoiceOverClient).toHaveBeenCalledWith(options);
        });

        it("should construct a caption instance", () => {
          expect(VoiceOverCaption).toHaveBeenCalledWith(VoiceOverClientStub);
        });

        it("should construct a commander instance", () => {
          expect(VoiceOverCommander).toHaveBeenCalledWith(VoiceOverClientStub);
        });

        it("should construct a cursor instance", () => {
          expect(VoiceOverCursor).toHaveBeenCalledWith(VoiceOverClientStub);
        });

        it("should construct a keyboard instance", () => {
          expect(VoiceOverKeyboard).toHaveBeenCalledWith(VoiceOverClientStub);
        });

        it("should construct a mouse instance", () => {
          expect(VoiceOverMouse).toHaveBeenCalledWith(VoiceOverClientStub);
        });

        it("should expose a getter for keyboard commands", () => {
          expect(vo.keyboardCommands).toBe(VoiceOverKeyboardStub.commands);
        });

        it("should expose a getter for commander commands", () => {
          expect(vo.commanderCommands).toBe(VoiceOverCommanderStub.commands);
        });

        it("should mount Guidepup preferences", () => {
          expect(mountGuidepupPreferences).toHaveBeenCalled();
        });

        it("should start VoiceOver", () => {
          expect(start).toHaveBeenCalled();
        });

        it("should wait for VoiceOver to be running", () => {
          expect(waitForRunning).toHaveBeenCalledWith(options);
        });
      });

      describe("when called with custom settings", () => {
        const settings = { testSettingKey: "test-setting-value" };

        beforeEach(async () => {
          await vo.start({ settings });
        });

        it("should configure VoiceOver with the desired settings", () => {
          expect(setPreferences).toHaveBeenCalledWith(settings);
        });
      });

      describe("when VoiceOver does not become ready", () => {
        const startupError = new Error("VoiceOver did not become ready");
        let thrownError: Error;

        beforeEach(async () => {
          jest.mocked(waitForRunning).mockRejectedValue(startupError);

          try {
            await vo.start();
          } catch (error) {
            thrownError = error as Error;
          }
        });

        test("should retry from a clean VoiceOver process", () => {
          expect(start).toHaveBeenCalledTimes(2);
          expect(terminateVoiceOverProcess).toHaveBeenCalledTimes(3);
          expect(waitForNotRunning).toHaveBeenCalledTimes(2);
        });

        test("should return a stable startup error with the readiness failure as its cause", () => {
          expect(thrownError).toEqual(
            new Error(ERR_VOICE_OVER_CANNOT_BE_STARTED, {
              cause: startupError,
            }),
          );
        });

        test("should unmount Guidepup preferences after failing", () => {
          expect(unmountGuidepupPreferences).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe("getSettings", () => {
    const settingsStub = { testSetting: true };

    describe("when VoiceOver is not running", () => {
      it("should return the current settings", async () => {
        jest.mocked(getPreferences).mockReturnValue(settingsStub);

        expect(vo.getSettings()).toEqual(settingsStub);
      });
    });

    describe("when VoiceOver is running", () => {
      it("should return the current settings", async () => {
        jest.mocked(getPreferences).mockReturnValue(settingsStub);

        await vo.start();
        result = vo.getSettings();
        await vo.stop();

        expect(result).toEqual(settingsStub);
      });
    });
  });

  describe("getSetting", () => {
    const settingStub = "test-value";

    describe("when VoiceOver is not running", () => {
      it("should return the value for the setting", async () => {
        jest.mocked(getPreference).mockReturnValue(settingStub);

        expect(vo.getSetting("test-setting")).toBe(settingStub);
      });
    });

    describe("when VoiceOver is running", () => {
      it("should return the value for the setting", async () => {
        jest.mocked(getPreference).mockReturnValue(settingStub);

        await vo.start();
        result = vo.getSetting("test-setting");
        await vo.stop();

        expect(result).toBe(settingStub);
      });
    });
  });

  describe("stop", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.stop()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        jest.mocked(isMacOS).mockReturnValue(true);

        await vo.start();

        jest.clearAllMocks();

        await vo.stop(options);
      });

      it("should quit VoiceOver", () => {
        expect(terminateVoiceOverProcess).toHaveBeenCalled();
      });

      it("should wait for VoiceOver to not be running", () => {
        expect(waitForNotRunning).toHaveBeenCalledWith(options);
      });

      it("should unmount Guidepup preferences", () => {
        expect(unmountGuidepupPreferences).toHaveBeenCalled();
      });

      describe("when called again and start hasn't been called this time", () => {
        it("should throw an error", async () => {
          await expect(async () => await vo.stop(options)).rejects.toThrow(
            ERR_VOICE_OVER_NOT_RUNNING,
          );
        });
      });
    });
  });

  describe("previous", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.previous()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.start();
        await vo.previous(options);
        await vo.stop();
      });

      it("should move the cursor to the previous item", () => {
        expect(VoiceOverCursorStub.previous).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("next", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.next()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.start();
        await vo.next(options);
        await vo.stop();
      });

      it("should move the cursor to the next item", () => {
        expect(VoiceOverCursorStub.next).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("previousHeading", () => {
    beforeEach(() => {
      jest.mocked(isKeyboard).mockReturnValue(true);
    });

    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.previousHeading()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.start();
        await vo.previousHeading(options);
        await vo.stop();
      });

      it("should perform a keyboard command to find the previous heading", () => {
        expect(VoiceOverKeyboardStub.perform).toHaveBeenCalledWith(
          keyCodeCommands.findPreviousHeading,
          options,
        );
      });
    });
  });

  describe("nextHeading", () => {
    beforeEach(() => {
      jest.mocked(isKeyboard).mockReturnValue(true);
    });

    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.nextHeading()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.start();
        await vo.nextHeading(options);
        await vo.stop();
      });

      it("should perform a keyboard command to find the next heading", () => {
        expect(VoiceOverKeyboardStub.perform).toHaveBeenCalledWith(
          keyCodeCommands.findNextHeading,
          options,
        );
      });
    });
  });

  describe("previousLink", () => {
    beforeEach(() => {
      jest.mocked(isKeyboard).mockReturnValue(true);
    });

    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.previousLink()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.start();
        await vo.previousLink(options);
        await vo.stop();
      });

      it("should perform a keyboard command to find the previous link", () => {
        expect(VoiceOverKeyboardStub.perform).toHaveBeenCalledWith(
          keyCodeCommands.findPreviousLink,
          options,
        );
      });
    });
  });

  describe("nextLink", () => {
    beforeEach(() => {
      jest.mocked(isKeyboard).mockReturnValue(true);
    });

    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.nextLink()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.start();
        await vo.nextLink(options);
        await vo.stop();
      });

      it("should perform a keyboard command to find the next link", () => {
        expect(VoiceOverKeyboardStub.perform).toHaveBeenCalledWith(
          keyCodeCommands.findNextLink,
          options,
        );
      });
    });
  });

  describe("previousLandmark", () => {
    beforeEach(() => {
      jest.mocked(isKeyboard).mockReturnValue(true);
    });

    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.previousLandmark()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.start();
        await vo.previousLandmark(options);
        await vo.stop();
      });

      it("should perform a keyboard command to move to the previous landmark", () => {
        expect(VoiceOverKeyboardStub.perform).toHaveBeenCalledWith(
          keyCodeCommands.moveToPreviousAutoWebSpot,
          options,
        );
      });
    });
  });

  describe("nextLandmark", () => {
    beforeEach(() => {
      jest.mocked(isKeyboard).mockReturnValue(true);
    });

    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.nextLandmark()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.start();
        await vo.nextLandmark(options);
        await vo.stop();
      });

      it("should perform a keyboard command to move to the next landmark", () => {
        expect(VoiceOverKeyboardStub.perform).toHaveBeenCalledWith(
          keyCodeCommands.moveToNextAutoWebSpot,
          options,
        );
      });
    });
  });

  describe("act", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.act()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.start();
        await vo.act(options);
        await vo.stop();
      });

      it("should perform the default action for the item", () => {
        expect(VoiceOverCursorStub.act).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("interact", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.interact()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.start();
        await vo.interact(options);
        await vo.stop();
      });

      it("should interact with the item", () => {
        expect(VoiceOverCursorStub.interact).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("stopInteracting", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.stopInteracting()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.start();
        await vo.stopInteracting(options);
        await vo.stop();
      });

      it("should stop interacting with the item", () => {
        expect(VoiceOverCursorStub.stopInteracting).toHaveBeenCalledWith(
          options,
        );
      });
    });
  });

  describe("takeCursorScreenshot", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(
          async () => await vo.takeCursorScreenshot(),
        ).rejects.toThrow(ERR_VOICE_OVER_NOT_RUNNING);
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.start();
        await vo.takeCursorScreenshot(options);
        await vo.stop();
      });

      it("should take a cursor screenshot", () => {
        expect(VoiceOverCursorStub.takeScreenshot).toHaveBeenCalledWith(
          options,
        );
      });
    });
  });

  describe("press", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.press("test-key")).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      const key = "test-key";

      beforeEach(async () => {
        await vo.start();
        await vo.press(key, options);
        await vo.stop();
      });

      it("should press the key", () => {
        expect(VoiceOverKeyboardStub.press).toHaveBeenCalledWith(key, options);
      });
    });
  });

  describe("type", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.type("test-text")).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      const text = "test-text";

      beforeEach(async () => {
        await vo.start();
        await vo.type(text, options);
        await vo.stop();
      });

      it("should type the text", () => {
        expect(VoiceOverKeyboardStub.type).toHaveBeenCalledWith(text, options);
      });
    });
  });

  describe("perform", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(
          async () => await vo.perform({ keyCode: 0 }),
        ).rejects.toThrow(ERR_VOICE_OVER_NOT_RUNNING);
      });
    });

    describe.each`
      description                                    | command           | options
      ${"with keyboard command and without options"} | ${{ keyCode: 0 }} | ${undefined}
      ${"with keyboard command and with options"}    | ${{ keyCode: 0 }} | ${{}}
    `("when called $description", ({ command, options }) => {
      beforeEach(async () => {
        jest.mocked(isKeyboard).mockReturnValue(true);

        await vo.start();
        await vo.perform(command, options);
        await vo.stop();
      });

      it("should perform the keyboard command", () => {
        expect(VoiceOverKeyboardStub.perform).toHaveBeenCalledWith(
          command,
          options,
        );
      });
    });

    describe.each`
      description                                     | command                      | options
      ${"with commander command and without options"} | ${CommanderCommands.ACTIONS} | ${undefined}
      ${"with commander command and with options"}    | ${CommanderCommands.ACTIONS} | ${{}}
    `("when called $description", ({ command, options }) => {
      beforeEach(async () => {
        jest.mocked(isKeyboard).mockReturnValue(false);

        await vo.start();
        await vo.perform(command, options);
        await vo.stop();
      });

      it("should perform the commander command", () => {
        expect(VoiceOverCommanderStub.perform).toHaveBeenCalledWith(
          command,
          options,
        );
      });
    });
  });

  describe("click", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.click()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.start();
        await vo.click(options);
        await vo.stop();
      });

      it("should click the mouse", () => {
        expect(VoiceOverMouseStub.click).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("copyLastSpokenPhrase", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(
          async () => await vo.copyLastSpokenPhrase(),
        ).rejects.toThrow(ERR_VOICE_OVER_NOT_RUNNING);
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.start();
        await vo.copyLastSpokenPhrase(options);
        await vo.stop();
      });

      it("should copy the last spoken phrase", () => {
        expect(VoiceOverCaptionStub.copyLastSpokenPhrase).toHaveBeenCalledWith(
          options,
        );
      });
    });
  });

  describe("saveLastSpokenPhrase", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(
          async () => await vo.saveLastSpokenPhrase(),
        ).rejects.toThrow(ERR_VOICE_OVER_NOT_RUNNING);
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.start();
        await vo.saveLastSpokenPhrase(options);
        await vo.stop();
      });

      it("should save the last spoken phrase", () => {
        expect(VoiceOverCaptionStub.saveLastSpokenPhrase).toHaveBeenCalledWith(
          options,
        );
      });
    });
  });

  describe("lastSpokenPhrase", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.lastSpokenPhrase()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    beforeEach(async () => {
      await vo.start();
      await vo.lastSpokenPhrase();
      await vo.stop();
    });

    it("should get the last spoken phrase", () => {
      expect(VoiceOverCaptionStub.lastSpokenPhrase).toHaveBeenCalled();
    });
  });

  describe("itemText", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.itemText()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    beforeEach(async () => {
      await vo.start();
      await vo.itemText();
      await vo.stop();
    });

    it("should get the item text", () => {
      expect(VoiceOverCaptionStub.itemText).toHaveBeenCalled();
    });
  });

  describe("spokenPhraseLog", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.spokenPhraseLog()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    beforeEach(async () => {
      await vo.start();
      await vo.spokenPhraseLog();
      await vo.stop();
    });

    it("should get the spoken phrase log", () => {
      expect(VoiceOverCaptionStub.spokenPhraseLog).toHaveBeenCalled();
    });
  });

  describe("clearSpokenPhraseLog", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(
          async () => await vo.clearSpokenPhraseLog(),
        ).rejects.toThrow(ERR_VOICE_OVER_NOT_RUNNING);
      });
    });

    beforeEach(async () => {
      await vo.start();
      await vo.clearSpokenPhraseLog();
      await vo.stop();
    });

    it("should clear the spoken phrase log", () => {
      expect(VoiceOverCaptionStub.clearSpokenPhraseLog).toHaveBeenCalled();
    });
  });

  describe("itemTextLog", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.itemTextLog()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    beforeEach(async () => {
      await vo.start();
      await vo.itemTextLog();
      await vo.stop();
    });

    it("should get the item text log", () => {
      expect(VoiceOverCaptionStub.itemTextLog).toHaveBeenCalled();
    });
  });

  describe("clearItemTextLog", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.clearItemTextLog()).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    beforeEach(async () => {
      await vo.start();
      await vo.clearItemTextLog();
      await vo.stop();
    });

    it("should clear the item text log", () => {
      expect(VoiceOverCaptionStub.clearItemTextLog).toHaveBeenCalled();
    });
  });

  describe("when stop is in progress", () => {
    let stopPromise: Promise<void>;
    let resolveTerminate: () => void;

    beforeEach(async () => {
      jest.mocked(isMacOS).mockReturnValue(true);

      await vo.start();

      jest.clearAllMocks();

      jest.mocked(terminateVoiceOverProcess).mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveTerminate = resolve;
          }),
      );

      stopPromise = vo.stop();

      await delay(0);
    });

    afterEach(async () => {
      resolveTerminate();
      await stopPromise;
    });

    it("should throw when calling previous", async () => {
      await expect(async () => await vo.previous()).rejects.toThrow(
        ERR_VOICE_OVER_NOT_RUNNING,
      );
    });

    it("should throw when calling next", async () => {
      await expect(async () => await vo.next()).rejects.toThrow(
        ERR_VOICE_OVER_NOT_RUNNING,
      );
    });

    it("should throw when calling act", async () => {
      await expect(async () => await vo.act()).rejects.toThrow(
        ERR_VOICE_OVER_NOT_RUNNING,
      );
    });

    it("should throw when calling interact", async () => {
      await expect(async () => await vo.interact()).rejects.toThrow(
        ERR_VOICE_OVER_NOT_RUNNING,
      );
    });

    it("should throw when calling stopInteracting", async () => {
      await expect(async () => await vo.stopInteracting()).rejects.toThrow(
        ERR_VOICE_OVER_NOT_RUNNING,
      );
    });

    it("should throw when calling perform", async () => {
      await expect(
        async () => await vo.perform(CommanderCommands.ACTIONS),
      ).rejects.toThrow(ERR_VOICE_OVER_NOT_RUNNING);
    });

    it("should throw when calling press", async () => {
      await expect(async () => await vo.press("return")).rejects.toThrow(
        ERR_VOICE_OVER_NOT_RUNNING,
      );
    });

    it("should throw when calling lastSpokenPhrase", async () => {
      await expect(async () => await vo.lastSpokenPhrase()).rejects.toThrow(
        ERR_VOICE_OVER_NOT_RUNNING,
      );
    });

    it("should throw when calling spokenPhraseLog", async () => {
      await expect(async () => await vo.spokenPhraseLog()).rejects.toThrow(
        ERR_VOICE_OVER_NOT_RUNNING,
      );
    });

    it("should throw when calling itemText", async () => {
      await expect(async () => await vo.itemText()).rejects.toThrow(
        ERR_VOICE_OVER_NOT_RUNNING,
      );
    });
  });

  describe("capture", () => {
    const actionStub = jest.fn();
    const outputStub = {
      itemText: "test-item-text",
      result: "test-result",
      spokenPhrase: "test-spoken-phrase",
    };

    beforeEach(() => {
      jest
        .mocked(VoiceOverClientStub.enqueueAndTap)
        .mockResolvedValue(outputStub);
    });

    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.capture(actionStub)).rejects.toThrow(
          ERR_VOICE_OVER_NOT_RUNNING,
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      let output: unknown;

      beforeEach(async () => {
        await vo.start();
        output = await vo.capture(actionStub, options);
        await vo.stop();
      });

      it("should enqueue and tap an async wrapper of the provided action", async () => {
        expect(VoiceOverClientStub.enqueueAndTap).toHaveBeenCalledWith(
          expect.any(Function),
          options,
        );

        expect(actionStub).not.toHaveBeenCalled();

        await jest.mocked(VoiceOverClientStub.enqueueAndTap).mock.calls[0][0]();

        expect(actionStub).toHaveBeenCalled();
      });

      it("should return the result of the action, item text, and spoken phrase", async () => {
        expect(output).toBe(outputStub);
      });
    });
  });
});
