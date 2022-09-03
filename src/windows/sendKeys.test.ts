import { ERR_SEND_KEYS } from "./errors";
import { isKeyCode } from "../isKeyCode";
import { mockType } from "../../test/mockType";
import { Modifiers } from "./Modifiers";
import { runVbsCode } from "./runVbsCode";
import { sendKeys } from "./sendKeys";

jest.mock("../isKeyCode", () => ({
  isKeyCode: jest.fn(),
}));
jest.mock("./runVbsCode", () => ({
  runVbsCode: jest.fn(),
}));

describe("sendKeys", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when a key code command without modifiers is provided", () => {
    const mockCommand = { keyCode: "test-key-code" };

    beforeEach(async () => {
      mockType(isKeyCode).mockReturnValue(true);

      await sendKeys(mockCommand);
    });

    it("should check if the provided command is a key code command", () => {
      expect(isKeyCode).toHaveBeenCalledWith(mockCommand);
    });

    it("should run a vbs script to send the keys", () => {
      expect(runVbsCode).toHaveBeenCalledWith(
        `set WshShell = CreateObject("WScript.Shell")\nWshShell.SendKeys "${mockCommand.keyCode}"`
      );
    });
  });

  describe("when a key code command with modifiers is provided", () => {
    const mockCommand = {
      keyCode: "test-key-code",
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
      expect(runVbsCode).toHaveBeenCalledWith(
        `set WshShell = CreateObject("WScript.Shell")\nWshShell.SendKeys "${mockCommand.modifiers.join(
          ""
        )}${mockCommand.keyCode}"`
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
      expect(runVbsCode).toHaveBeenCalledWith(
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
      expect(runVbsCode).toHaveBeenCalledWith(
        `set WshShell = CreateObject("WScript.Shell")\nWshShell.SendKeys "${mockCommand.modifiers.join(
          ""
        )}${mockCommand.characters}"`
      );
    });
  });

  describe("when running the vbs script throws an error", () => {
    const mockCommand = { keyCode: "test-key-code" };
    const mockError = new Error("test-error");

    beforeEach(() => {
      mockType(isKeyCode).mockReturnValue(true);
      mockType(runVbsCode).mockRejectedValue(mockError);
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
