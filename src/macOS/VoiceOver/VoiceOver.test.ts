import {
  configureSettings,
  DEFAULT_GUIDEPUP_VOICEOVER_SETTINGS,
  storeOriginalSettings,
} from "./configureSettings";
import {
  ERR_VOICE_OVER_ALREADY_RUNNING,
  ERR_VOICE_OVER_NOT_RUNNING,
  ERR_VOICE_OVER_NOT_SUPPORTED,
} from "../errors";
import { CommanderCommands } from "./CommanderCommands";
import { forceQuit } from "./forceQuit";
import { isKeyboard } from "../../isKeyboard";
import { isMacOS } from "../isMacOS";
import { LogStore } from "./LogStore";
import { start } from "./start";
import { supportsAppleScriptControl } from "./supportsAppleScriptControl";
import { VoiceOver } from "./VoiceOver";
import { VoiceOverCaption } from "./VoiceOverCaption";
import { VoiceOverCommander } from "./VoiceOverCommander";
import { VoiceOverCursor } from "./VoiceOverCursor";
import { VoiceOverKeyboard } from "./VoiceOverKeyboard";
import { VoiceOverMouse } from "./VoiceOverMouse";
import { waitForNotRunning } from "./waitForNotRunning";
import { waitForRunning } from "./waitForRunning";

jest.mock("./configureSettings", () => ({
  configureSettings: jest.fn(),
  storeOriginalSettings: jest.fn(),
  DEFAULT_GUIDEPUP_VOICEOVER_SETTINGS: Symbol(
    "test-default-guidepup-voiceover-settings"
  ),
}));
jest.mock("../../isKeyboard", () => ({
  isKeyboard: jest.fn(),
}));
jest.mock("../isMacOS", () => ({
  isMacOS: jest.fn(),
}));
jest.mock("./LogStore", () => ({
  LogStore: jest.fn(),
}));
jest.mock("./forceQuit", () => ({
  forceQuit: jest.fn(),
}));
jest.mock("./start", () => ({
  start: jest.fn(),
}));
jest.mock("./supportsAppleScriptControl", () => ({
  supportsAppleScriptControl: jest.fn(),
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

const VoiceOverCaptionStub = {
  lastSpokenPhrase: jest.fn(),
  itemText: jest.fn(),
  spokenPhraseLog: jest.fn(),
  itemTextLog: jest.fn(),
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
  let vo, result;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    (VoiceOverCaption as jest.Mock<VoiceOverCaption>).mockImplementation(
      () => VoiceOverCaptionStub as unknown as VoiceOverCaption
    );
    (VoiceOverCommander as jest.Mock<VoiceOverCommander>).mockImplementation(
      () => VoiceOverCommanderStub as unknown as VoiceOverCommander
    );
    (VoiceOverCursor as jest.Mock<VoiceOverCursor>).mockImplementation(
      () => VoiceOverCursorStub as unknown as VoiceOverCursor
    );
    (VoiceOverKeyboard as jest.Mock<VoiceOverKeyboard>).mockImplementation(
      () => VoiceOverKeyboardStub as unknown as VoiceOverKeyboard
    );
    (VoiceOverMouse as jest.Mock<VoiceOverMouse>).mockImplementation(
      () => VoiceOverMouseStub as unknown as VoiceOverMouse
    );

    jest.mocked(isMacOS).mockReturnValue(true);
    jest.mocked(supportsAppleScriptControl).mockResolvedValue(true);

    vo = new VoiceOver();
    result = undefined;
  });

  describe("detect", () => {
    describe.each`
      macOS    | supportsControl | expected
      ${false} | ${false}        | ${false}
      ${true}  | ${false}        | ${false}
      ${false} | ${true}         | ${false}
      ${true}  | ${true}         | ${true}
    `(
      "when is macOS is $macOS and supports AppleScript control is $supportsControl",
      ({ macOS, supportsControl, expected }) => {
        beforeEach(async () => {
          jest.mocked(isMacOS).mockReturnValue(macOS);
          jest
            .mocked(supportsAppleScriptControl)
            .mockResolvedValue(supportsControl);

          result = await vo.detect();
        });

        it(`should return ${expected}`, () => {
          expect(result).toBe(expected);
        });
      }
    );
  });

  describe("default", () => {
    describe.each`
      macOS    | expected
      ${false} | ${false}
      ${true}  | ${true}
    `("when is macOS is $macOS", ({ macOS, expected }) => {
      beforeEach(async () => {
        jest.mocked(isMacOS).mockReturnValue(macOS);

        result = await vo.default();
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
        await expect(vo.start.bind(vo)).rejects.toThrowError(
          ERR_VOICE_OVER_NOT_SUPPORTED
        );
      });
    });

    describe("when VoiceOver is supported", () => {
      describe("when VoiceOver is already running", () => {
        beforeEach(async () => {
          await vo.start();
        });

        it("should throw an error when trying to start again", async () => {
          await expect(async () => await vo.start()).rejects.toThrowError(
            ERR_VOICE_OVER_ALREADY_RUNNING
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

        it("should construct a log store instance", () => {
          expect(LogStore).toHaveBeenCalledWith(options);
        });

        it("should construct a caption instance", () => {
          expect(VoiceOverCaption).toHaveBeenCalledWith(expect.any(LogStore));
        });

        it("should construct a commander instance", () => {
          expect(VoiceOverCommander).toHaveBeenCalledWith(expect.any(LogStore));
        });

        it("should construct a cursor instance", () => {
          expect(VoiceOverCursor).toHaveBeenCalledWith(expect.any(LogStore));
        });

        it("should construct a keyboard instance", () => {
          expect(VoiceOverKeyboard).toHaveBeenCalledWith(expect.any(LogStore));
        });

        it("should construct a mouse instance", () => {
          expect(VoiceOverMouse).toHaveBeenCalledWith(expect.any(LogStore));
        });

        it("should expose a getter for keyboard commands", () => {
          expect(vo.keyboardCommands).toBe(VoiceOverKeyboardStub.commands);
        });

        it("should expose a getter for commander commands", () => {
          expect(vo.commanderCommands).toBe(VoiceOverCommanderStub.commands);
        });

        it("should store original settings (so they can be reset back when done)", () => {
          expect(storeOriginalSettings).toHaveBeenCalled();
        });

        it("should configure settings", () => {
          expect(configureSettings).toHaveBeenCalledWith(
            DEFAULT_GUIDEPUP_VOICEOVER_SETTINGS
          );
        });

        it("should start VoiceOver", () => {
          expect(start).toHaveBeenCalled();
        });

        it("should wait for VoiceOver to be running", () => {
          expect(waitForRunning).toHaveBeenCalledWith(options);
        });
      });
    });
  });

  describe("stop", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.stop()).rejects.toThrowError(
          ERR_VOICE_OVER_NOT_RUNNING
        );
      });
    });

    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      const resetSettingsSpy = jest.fn();

      beforeEach(async () => {
        jest.mocked(isMacOS).mockReturnValue(true);
        jest.mocked(supportsAppleScriptControl).mockResolvedValue(true);
        jest.mocked(storeOriginalSettings).mockResolvedValue(resetSettingsSpy);

        await vo.start();

        jest.clearAllMocks();

        await vo.stop(options);
      });

      it("should quit VoiceOver", () => {
        expect(forceQuit).toHaveBeenCalled();
      });

      it("should wait for VoiceOver to not be running", () => {
        expect(waitForNotRunning).toHaveBeenCalledWith(options);
      });

      it("should reset settings", () => {
        expect(resetSettingsSpy).toHaveBeenCalled();
      });

      describe("when called again and start hasn't been called this time", () => {
        it("should throw an error", async () => {
          await expect(async () => await vo.stop(options)).rejects.toThrowError(
            ERR_VOICE_OVER_NOT_RUNNING
          );
        });
      });
    });
  });

  describe("previous", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.previous()).rejects.toThrowError(
          ERR_VOICE_OVER_NOT_RUNNING
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
        await expect(async () => await vo.next()).rejects.toThrowError(
          ERR_VOICE_OVER_NOT_RUNNING
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

  describe("act", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.act()).rejects.toThrowError(
          ERR_VOICE_OVER_NOT_RUNNING
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
        await expect(async () => await vo.interact()).rejects.toThrowError(
          ERR_VOICE_OVER_NOT_RUNNING
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
        await expect(
          async () => await vo.stopInteracting()
        ).rejects.toThrowError(ERR_VOICE_OVER_NOT_RUNNING);
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
          options
        );
      });
    });
  });

  describe("takeCursorScreenshot", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(
          async () => await vo.takeCursorScreenshot()
        ).rejects.toThrowError(ERR_VOICE_OVER_NOT_RUNNING);
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
          options
        );
      });
    });
  });

  describe("press", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.press()).rejects.toThrowError(
          ERR_VOICE_OVER_NOT_RUNNING
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
        await expect(async () => await vo.type()).rejects.toThrowError(
          ERR_VOICE_OVER_NOT_RUNNING
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
        await expect(async () => await vo.perform()).rejects.toThrowError(
          ERR_VOICE_OVER_NOT_RUNNING
        );
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
          options
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
          options
        );
      });
    });
  });

  describe("click", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.click()).rejects.toThrowError(
          ERR_VOICE_OVER_NOT_RUNNING
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
          async () => await vo.copyLastSpokenPhrase()
        ).rejects.toThrowError(ERR_VOICE_OVER_NOT_RUNNING);
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
          options
        );
      });
    });
  });

  describe("saveLastSpokenPhrase", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(
          async () => await vo.saveLastSpokenPhrase()
        ).rejects.toThrowError(ERR_VOICE_OVER_NOT_RUNNING);
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
          options
        );
      });
    });
  });

  describe("lastSpokenPhrase", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(
          async () => await vo.lastSpokenPhrase()
        ).rejects.toThrowError(ERR_VOICE_OVER_NOT_RUNNING);
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
        await expect(async () => await vo.itemText()).rejects.toThrowError(
          ERR_VOICE_OVER_NOT_RUNNING
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
        await expect(
          async () => await vo.spokenPhraseLog()
        ).rejects.toThrowError(ERR_VOICE_OVER_NOT_RUNNING);
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

  describe("itemTextLog", () => {
    describe("when VoiceOver is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await vo.itemTextLog()).rejects.toThrowError(
          ERR_VOICE_OVER_NOT_RUNNING
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
});
