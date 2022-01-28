import { VoiceOverBase } from "./VoiceOverBase";
import { mockType } from "../../../test/mockType";
import { ERR_VOICE_OVER_NOT_SUPPORTED } from "../errors";
import { isMacOS } from "../isMacOS";
import { supportsAppleScriptControl } from "./supportsAppleScriptControl";
import { disableSplashScreen } from "./disableSplashScreen";
import { start } from "./start";
import { waitForRunning } from "./waitForRunning";
import { quit } from "../quit";
import { Applications } from "../Applications";
import { sendKeys } from "../sendKeys";
import { move } from "./move";
import { click } from "./click";
import { getLastSpokenPhrase } from "./getLastSpokenPhrase";
import { copyLastSpokenPhrase } from "./copyLastSpokenPhrase";
import { saveLastSpokenPhrase } from "./saveLastSpokenPhrase";
import { takeScreenshot } from "./takeScreenshot";
import { getItemText } from "./getItemText";
import { performCommand } from "./performCommand";
import { performAction } from "./performAction";
import { Places } from "./Places";
import { Directions } from "./Directions";
import { CommanderCommands } from "./CommanderCommands";
import { ClickCount } from "./ClickCount";
import { ClickButton } from "./ClickButton";

jest.mock("../isMacOS", () => ({
  isMacOS: jest.fn(),
}));
jest.mock("./supportsAppleScriptControl", () => ({
  supportsAppleScriptControl: jest.fn(),
}));
jest.mock("./disableSplashScreen", () => ({
  disableSplashScreen: jest.fn(),
}));
jest.mock("./start", () => ({
  start: jest.fn(),
}));
jest.mock("./waitForRunning", () => ({
  waitForRunning: jest.fn(),
}));
jest.mock("../quit", () => ({
  quit: jest.fn(),
}));
jest.mock("../sendKeys", () => ({
  sendKeys: jest.fn(),
}));
jest.mock("./move", () => ({
  move: jest.fn(),
}));
jest.mock("./click", () => ({
  click: jest.fn(),
}));
jest.mock("./getLastSpokenPhrase", () => ({
  getLastSpokenPhrase: jest.fn(),
}));
jest.mock("./copyLastSpokenPhrase", () => ({
  copyLastSpokenPhrase: jest.fn(),
}));
jest.mock("./saveLastSpokenPhrase", () => ({
  saveLastSpokenPhrase: jest.fn(),
}));
jest.mock("./takeScreenshot", () => ({
  takeScreenshot: jest.fn(),
}));
jest.mock("./getItemText", () => ({
  getItemText: jest.fn(),
}));
jest.mock("./performCommand", () => ({
  performCommand: jest.fn(),
}));
jest.mock("./performAction", () => ({
  performAction: jest.fn(),
}));

const spokenPhraseDummy = "test-spoken-phrase";
const itemTextDummy = "test-item-text";

describe("VoiceOverBase", () => {
  let vo, result;

  const commonTapAssertions = () => {
    it("should update the spoken phrase log", () => {
      expect(vo.getSpokenPhraseLog()).toHaveLength(1);
    });

    it("should update the item text log", () => {
      expect(vo.getItemTextLog()).toHaveLength(1);
    });
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    mockType(getLastSpokenPhrase).mockResolvedValue(spokenPhraseDummy);
    mockType(getItemText).mockResolvedValue(itemTextDummy);

    vo = new VoiceOverBase();
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
          mockType(isMacOS).mockReturnValue(macOS);
          mockType(supportsAppleScriptControl).mockResolvedValue(
            supportsControl
          );

          result = await VoiceOverBase.detect();
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

        result = await VoiceOverBase.default();
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
        await expect(vo.start).rejects.toThrowError(
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
        expect(quit).toHaveBeenCalledWith(Applications.VOICE_OVER, options);
      });
    });
  });

  describe("sendKeys", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      const keyCommand = {
        characters: "test-characters",
      };

      beforeEach(async () => {
        await vo.sendKeys(keyCommand, options);
      });

      commonTapAssertions();

      it("should send the key command to VoiceOver", () => {
        expect(sendKeys).toHaveBeenCalledWith(
          Applications.VOICE_OVER,
          keyCommand,
          options
        );
      });
    });
  });

  describe("move", () => {
    describe.each`
      description                         | place             | options
      ${"without place, without options"} | ${undefined}      | ${undefined}
      ${"without place, with options"}    | ${undefined}      | ${{}}
      ${"with place, without options"}    | ${Places.DESKTOP} | ${undefined}
      ${"with place, with options"}       | ${Places.DESKTOP} | ${{}}
    `("when called $description", ({ place, options }) => {
      const direction = Directions.DOWN;

      beforeEach(async () => {
        await vo.move(direction, place, options);
      });

      commonTapAssertions();

      it("should send the move to VoiceOver", () => {
        expect(move).toHaveBeenCalledWith(direction, place, options);
      });
    });
  });

  describe("movePrevious", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.movePrevious(options);
      });

      commonTapAssertions();

      it("should send the move to VoiceOver", () => {
        expect(move).toHaveBeenCalledWith(Directions.LEFT, undefined, options);
      });
    });
  });

  describe("moveNext", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.moveNext(options);
      });

      commonTapAssertions();

      it("should send the move to VoiceOver", () => {
        expect(move).toHaveBeenCalledWith(Directions.RIGHT, undefined, options);
      });
    });
  });

  describe("performAction", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.performAction(options);
      });

      commonTapAssertions();

      it("should send the action command to VoiceOver", () => {
        expect(performAction).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("performCommand", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      const command = CommanderCommands.ACTIONS;

      beforeEach(async () => {
        await vo.performCommand(command, options);
      });

      commonTapAssertions();

      it("should send the action command to VoiceOver", () => {
        expect(performCommand).toHaveBeenCalledWith(command, options);
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

      commonTapAssertions();

      it("should tell VoiceOver to left click once", () => {
        expect(click).toHaveBeenCalledWith(
          ClickCount.ONCE,
          ClickButton.LEFT_BUTTON,
          options
        );
      });
    });
  });

  describe("doubleClick", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.doubleClick(options);
      });

      commonTapAssertions();

      it("should tell VoiceOver to left click twice", () => {
        expect(click).toHaveBeenCalledWith(
          ClickCount.TWICE,
          ClickButton.LEFT_BUTTON,
          options
        );
      });
    });
  });

  describe("tripleClick", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.tripleClick(options);
      });

      commonTapAssertions();

      it("should tell VoiceOver to left click thrice", () => {
        expect(click).toHaveBeenCalledWith(
          ClickCount.THRICE,
          ClickButton.LEFT_BUTTON,
          options
        );
      });
    });
  });

  describe("rightClick", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.rightClick(options);
      });

      commonTapAssertions();

      it("should tell VoiceOver to right click once", () => {
        expect(click).toHaveBeenCalledWith(
          ClickCount.ONCE,
          ClickButton.RIGHT_BUTTON,
          options
        );
      });
    });
  });

  describe("rightDoubleClick", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.rightDoubleClick(options);
      });

      commonTapAssertions();

      it("should tell VoiceOver to right click twice", () => {
        expect(click).toHaveBeenCalledWith(
          ClickCount.TWICE,
          ClickButton.RIGHT_BUTTON,
          options
        );
      });
    });
  });

  describe("rightTripleClick", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.rightTripleClick(options);
      });

      commonTapAssertions();

      it("should tell VoiceOver to right click thrice", () => {
        expect(click).toHaveBeenCalledWith(
          ClickCount.THRICE,
          ClickButton.RIGHT_BUTTON,
          options
        );
      });
    });
  });

  describe("takeScreenshot", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      const expected = "test-screenshot-path";

      beforeEach(async () => {
        mockType(takeScreenshot).mockResolvedValue(expected);

        result = await vo.takeScreenshot(options);
      });

      it("should take a screenshot of the VoiceOver cursor", () => {
        expect(takeScreenshot).toHaveBeenCalledWith(options);
      });

      it("should return the file path to the screenshot", () => {
        expect(result).toEqual(expected);
      });
    });
  });

  describe("getLastSpokenPhrase", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        result = await vo.getLastSpokenPhrase(options);
      });

      it("should get the last spoken phrase from VoiceOver", () => {
        expect(getLastSpokenPhrase).toHaveBeenCalledWith(options);
      });

      it("should return the last spoken phrase", () => {
        expect(result).toEqual(spokenPhraseDummy);
      });
    });
  });

  describe("copyLastSpokenPhrase", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.copyLastSpokenPhrase(options);
      });

      it("should copy the last spoken phrase from VoiceOver to the clipboard", () => {
        expect(copyLastSpokenPhrase).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("saveLastSpokenPhrase", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await vo.saveLastSpokenPhrase(options);
      });

      it("should save the last spoken phrase from VoiceOver to a file on the desktop", () => {
        expect(saveLastSpokenPhrase).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("getSpokenPhraseLog", () => {
    it("should get a log of the spoken phrases", async () => {
      const actionCount = 10;

      for (let i = 0; i < actionCount; i++) {
        await vo.moveNext();
      }

      expect(vo.getSpokenPhraseLog()).toEqual(
        new Array(actionCount).fill(spokenPhraseDummy)
      );
    });
  });

  describe("getItemText", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        result = await vo.getItemText(options);
      });

      it("should get the item text under the VoiceOver cursor", () => {
        expect(getItemText).toHaveBeenCalledWith(options);
      });

      it("should return the item text", () => {
        expect(result).toEqual(itemTextDummy);
      });
    });
  });

  describe("getItemTextLog", () => {
    it("should get a log of the item text", async () => {
      const actionCount = 10;

      for (let i = 0; i < actionCount; i++) {
        await vo.moveNext();
      }

      expect(vo.getItemTextLog()).toEqual(
        new Array(actionCount).fill(itemTextDummy)
      );
    });
  });
});
