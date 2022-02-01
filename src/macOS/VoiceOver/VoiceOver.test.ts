import { Applications } from "../Applications";
import { disableSplashScreen } from "./disableSplashScreen";
import { ERR_VOICE_OVER_NOT_SUPPORTED } from "../errors";
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
import { waitForRunning } from "./waitForRunning";

jest.mock("./disableSplashScreen", () => ({
  disableSplashScreen: jest.fn(),
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
jest.mock("./waitForRunning", () => ({
  waitForRunning: jest.fn(),
}));

describe("VoiceOver", () => {
  let vo, result;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    vo = new VoiceOver();
    result = undefined;
  });

  it("should construct a log store instance", () => {
    expect(LogStore).toHaveBeenCalledWith(vo);
  });

  it("should construct a caption instance", () => {
    expect(VoiceOverCaption).toHaveBeenCalledWith(expect.any(LogStore));
    expect(vo.caption).toBeInstanceOf(VoiceOverCaption);
  });

  it("should construct a commander instance", () => {
    expect(VoiceOverCommander).toHaveBeenCalledWith(expect.any(LogStore));
    expect(vo.commander).toBeInstanceOf(VoiceOverCommander);
  });

  it("should construct a cursor instance", () => {
    expect(VoiceOverCursor).toHaveBeenCalledWith(expect.any(LogStore));
    expect(vo.cursor).toBeInstanceOf(VoiceOverCursor);
  });

  it("should construct a keyboard instance", () => {
    expect(VoiceOverKeyboard).toHaveBeenCalledWith(expect.any(LogStore));
    expect(vo.keyboard).toBeInstanceOf(VoiceOverKeyboard);
  });

  it("should construct a mouse instance", () => {
    expect(VoiceOverMouse).toHaveBeenCalledWith(expect.any(LogStore));
    expect(vo.mouse).toBeInstanceOf(VoiceOverMouse);
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

          result = await VoiceOver.detect();
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

        result = await VoiceOver.default();
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
        expect(quit).toHaveBeenCalledWith(Applications.VoiceOver, options);
      });
    });
  });
});
