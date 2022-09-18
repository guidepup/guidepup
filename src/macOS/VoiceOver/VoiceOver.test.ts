import { Applications } from "../Applications";
import { CommanderCommands } from "./CommanderCommands";
import { disableSplashScreen } from "./disableSplashScreen";
import { ERR_VOICE_OVER_NOT_SUPPORTED } from "../errors";
import { isKeyboard } from "../../isKeyboard";
import { isMacOS } from "../isMacOS";
import { LogStore } from "../../LogStore";
import { mockType } from "../../../test/mockType";
import { quit } from "../quit";
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

jest.mock("./disableSplashScreen", () => ({
  disableSplashScreen: jest.fn(),
}));
jest.mock("../../isKeyboard", () => ({
  isKeyboard: jest.fn(),
}));
jest.mock("../isMacOS", () => ({
  isMacOS: jest.fn(),
}));
jest.mock("../../LogStore", () => ({
  LogStore: jest.fn(),
}));
jest.mock("../quit", () => ({
  quit: jest.fn(),
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
};

const VoiceOverCommanderStub = {
  perform: jest.fn(),
};

const VoiceOverCursorStub = {
  previous: jest.fn(),
  next: jest.fn(),
  act: jest.fn(),
  interact: jest.fn(),
  stopInteracting: jest.fn(),
};

const VoiceOverKeyboardStub = {
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

    vo = new VoiceOver();
    result = undefined;
  });

  it("should construct a log store instance", () => {
    expect(LogStore).toHaveBeenCalledWith(vo);
  });

  it("should construct a caption instance", () => {
    expect(VoiceOverCaption).toHaveBeenCalledWith(expect.any(LogStore));
    expect(vo.caption).toEqual(VoiceOverCaptionStub);
  });

  it("should construct a commander instance", () => {
    expect(VoiceOverCommander).toHaveBeenCalledWith(expect.any(LogStore));
    expect(vo.commander).toEqual(VoiceOverCommanderStub);
  });

  it("should construct a cursor instance", () => {
    expect(VoiceOverCursor).toHaveBeenCalledWith(expect.any(LogStore));
    expect(vo.cursor).toEqual(VoiceOverCursorStub);
  });

  it("should construct a keyboard instance", () => {
    expect(VoiceOverKeyboard).toHaveBeenCalledWith(expect.any(LogStore));
    expect(vo.keyboard).toEqual(VoiceOverKeyboardStub);
  });

  it("should construct a mouse instance", () => {
    expect(VoiceOverMouse).toHaveBeenCalledWith(expect.any(LogStore));
    expect(vo.mouse).toEqual(VoiceOverMouseStub);
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
          mockType(isMacOS).mockReturnValue(macOS);
          mockType(supportsAppleScriptControl).mockResolvedValue(
            supportsControl
          );

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
        mockType(isMacOS).mockReturnValue(macOS);

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
        mockType(isMacOS).mockReturnValue(false);
      });

      it("should throw", async () => {
        await expect(vo.start.bind(vo)).rejects.toThrowError(
          ERR_VOICE_OVER_NOT_SUPPORTED
        );
      });
    });

    describe("when VoiceOver is supported", () => {
      describe.each`
        description          | options
        ${"without options"} | ${undefined}
        ${"with options"}    | ${{}}
      `("when called $description", ({ options }) => {
        beforeEach(async () => {
          mockType(isMacOS).mockReturnValue(true);
          mockType(supportsAppleScriptControl).mockResolvedValue(true);

          await vo.start(options);
        });

        it("should disable the splash screen", () => {
          expect(disableSplashScreen).toHaveBeenCalled();
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
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.stop(options);
      });

      it("should quit VoiceOver", () => {
        expect(quit).toHaveBeenCalledWith(Applications.VoiceOver, options);
      });

      it("should wait for VoiceOver to not be running", () => {
        expect(waitForNotRunning).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("previous", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.previous(options);
      });

      it("should move the cursor to the previous item", () => {
        expect(vo.cursor.previous).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("next", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.next(options);
      });

      it("should move the cursor to the next item", () => {
        expect(vo.cursor.next).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("act", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.act(options);
      });

      it("should perform the default action for the item", () => {
        expect(vo.cursor.act).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("interact", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.interact(options);
      });

      it("should interact with the item", () => {
        expect(vo.cursor.interact).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("stopInteracting", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.stopInteracting(options);
      });

      it("should stop interacting with the item", () => {
        expect(vo.cursor.stopInteracting).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("press", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      const key = "test-key";

      beforeEach(async () => {
        await vo.press(key, options);
      });

      it("should press the key", () => {
        expect(vo.keyboard.press).toHaveBeenCalledWith(key, options);
      });
    });
  });

  describe("type", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      const text = "test-text";

      beforeEach(async () => {
        await vo.type(text, options);
      });

      it("should type the text", () => {
        expect(vo.keyboard.type).toHaveBeenCalledWith(text, options);
      });
    });
  });

  describe("perform", () => {
    describe.each`
      description                                    | command           | options
      ${"with keyboard command and without options"} | ${{ keyCode: 0 }} | ${undefined}
      ${"with keyboard command and with options"}    | ${{ keyCode: 0 }} | ${{}}
    `("when called $description", ({ command, options }) => {
      beforeEach(async () => {
        mockType(isKeyboard).mockReturnValue(true);

        await vo.perform(command, options);
      });

      it("should perform the keyboard command", () => {
        expect(vo.keyboard.perform).toHaveBeenCalledWith(command, options);
      });
    });

    describe.each`
      description                                     | command                      | options
      ${"with commander command and without options"} | ${CommanderCommands.ACTIONS} | ${undefined}
      ${"with commander command and with options"}    | ${CommanderCommands.ACTIONS} | ${{}}
    `("when called $description", ({ command, options }) => {
      beforeEach(async () => {
        mockType(isKeyboard).mockReturnValue(false);

        await vo.perform(command, options);
      });

      it("should perform the commander command", () => {
        expect(vo.commander.perform).toHaveBeenCalledWith(command, options);
      });
    });
  });

  describe("click", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.click(options);
      });

      it("should click the mouse", () => {
        expect(vo.mouse.click).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("lastSpokenPhrase", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.lastSpokenPhrase(options);
      });

      it("should get the last spoken phrase", () => {
        expect(vo.caption.lastSpokenPhrase).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("itemText", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.itemText(options);
      });

      it("should get the item text", () => {
        expect(vo.caption.itemText).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("spokenPhraseLog", () => {
    beforeEach(async () => {
      await vo.spokenPhraseLog();
    });

    it("should get the spoken phrase log", () => {
      expect(vo.caption.spokenPhraseLog).toHaveBeenCalled();
    });
  });

  describe("itemTextLog", () => {
    beforeEach(async () => {
      await vo.itemTextLog();
    });

    it("should get the item text log", () => {
      expect(vo.caption.itemTextLog).toHaveBeenCalled();
    });
  });
});
