import { ERR_SEND_KEYS } from "./errors";
import { isKeyCode } from "../isKeyCode";
import { Key } from "./Key";
import { mockType } from "../../test/mockType";
import { Modifiers } from "./Modifiers";
import { runVbsScript } from "./runVbsScript";
import { sendKeys } from "./sendKeys";

jest.mock("../isKeyCode", () => ({
  isKeyCode: jest.fn(),
}));
jest.mock("./runVbsScript", () => ({
  runVbsScript: jest.fn(),
}));

describe("sendKeys", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when a key code command without modifiers is provided", () => {
    const mockCommand = { keyCode: new Key({ symbol: "test-symbol" }) };

    beforeEach(async () => {
      mockType(isKeyCode).mockReturnValue(true);

      await sendKeys(mockCommand);
    });

    it("should check if the provided command is a key code command", () => {
      expect(isKeyCode).toHaveBeenCalledWith(mockCommand);
    });

    it("should run a vbs script to send the keys", () => {
      expect(runVbsScript).toHaveBeenCalledWith(
        `set WshShell = CreateObject("WScript.Shell")\nWshShell.SendKeys "${mockCommand.keyCode.symbol}"`
      );
    });
  });

  describe("when an array key code command without modifiers is provided", () => {
    const mockCommand = {
      keyCode: [
        new Key({ symbol: "test-symbol-1" }),
        new Key({ symbol: "test-symbol-2" }),
      ],
    };

    beforeEach(async () => {
      mockType(isKeyCode).mockReturnValue(true);

      await sendKeys(mockCommand);
    });

    it("should check if the provided command is a key code command", () => {
      expect(isKeyCode).toHaveBeenCalledWith(mockCommand);
    });

    it("should run a vbs script to send the keys", () => {
      expect(runVbsScript).toHaveBeenCalledWith(
        `set WshShell = CreateObject("WScript.Shell")\nWshShell.SendKeys "${mockCommand.keyCode[0].symbol}${mockCommand.keyCode[1].symbol}"`
      );
    });
  });

  describe("when a key code command with modifiers is provided", () => {
    const mockCommand = {
      keyCode: new Key({ symbol: "test-symbol" }),
      modifiers: [Modifiers.CONTROL],
    };

    beforeEach(async () => {
      mockType(isKeyCode).mockReturnValue(true);

      await sendKeys(mockCommand);
    });

    it("should check if the provided command is a key code command", () => {
      expect(isKeyCode).toHaveBeenCalledWith(mockCommand);
    });

    it("should run a vbs script to send the keys", () => {
      expect(runVbsScript).toHaveBeenCalledWith(
        `set WshShell = CreateObject("WScript.Shell")\nWshShell.SendKeys "${mockCommand.modifiers[0].symbol}${mockCommand.keyCode.symbol}"`
      );
    });
  });

  describe("when an array key code command with modifiers is provided", () => {
    const mockCommand = {
      keyCode: [
        new Key({ symbol: "test-symbol-1" }),
        new Key({ symbol: "test-symbol-2" }),
      ],
      modifiers: [Modifiers.CONTROL],
    };

    beforeEach(async () => {
      mockType(isKeyCode).mockReturnValue(true);

      await sendKeys(mockCommand);
    });

    it("should check if the provided command is a key code command", () => {
      expect(isKeyCode).toHaveBeenCalledWith(mockCommand);
    });

    it("should run a vbs script to send the keys", () => {
      expect(runVbsScript).toHaveBeenCalledWith(
        `set WshShell = CreateObject("WScript.Shell")\nWshShell.SendKeys "${mockCommand.modifiers[0].symbol}${mockCommand.keyCode[0].symbol}${mockCommand.keyCode[1].symbol}"`
      );
    });
  });

  describe("when a keystroke command without modifiers is provided", () => {
    const mockCommand = { characters: "test-characters" };

    beforeEach(async () => {
      mockType(isKeyCode).mockReturnValue(false);

      await sendKeys(mockCommand);
    });

    it("should check if the provided command is a key code command", () => {
      expect(isKeyCode).toHaveBeenCalledWith(mockCommand);
    });

    it("should run a vbs script to send the keys", () => {
      expect(runVbsScript).toHaveBeenCalledWith(
        `set WshShell = CreateObject("WScript.Shell")\nWshShell.SendKeys "${mockCommand.characters}"`
      );
    });
  });

  describe("when a keystroke command with modifiers is provided", () => {
    const mockCommand = {
      characters: "test-characters",
      modifiers: [Modifiers.ALT],
    };

    beforeEach(async () => {
      mockType(isKeyCode).mockReturnValue(false);

      await sendKeys(mockCommand);
    });

    it("should check if the provided command is a key code command", () => {
      expect(isKeyCode).toHaveBeenCalledWith(mockCommand);
    });

    it("should run a vbs script to send the keys", () => {
      expect(runVbsScript).toHaveBeenCalledWith(
        `set WshShell = CreateObject("WScript.Shell")\nWshShell.SendKeys "${mockCommand.modifiers[0].symbol}${mockCommand.characters}"`
      );
    });
  });

  describe("when running the vbs script throws an error", () => {
    const mockCommand = { keyCode: new Key({ symbol: "test-symbol" }) };
    const mockError = new Error("test-error");

    beforeEach(() => {
      mockType(isKeyCode).mockReturnValue(true);
      mockType(runVbsScript).mockRejectedValue(mockError);
    });

    it("should throw a wrapped error", async () => {
      let error;

      try {
        await sendKeys(mockCommand);
      } catch (e) {
        error = e;
      }
      expect(error).toEqual(
        new Error(`${ERR_SEND_KEYS}\n${mockError.message}`)
      );
    });
  });
});
