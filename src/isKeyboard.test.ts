import { isKeyboard } from "./isKeyboard";
import { isKeyCode } from "./isKeyCode";
import { isKeystroke } from "./isKeystroke";
import { mockType } from "../test/mockType";

jest.mock("./isKeyCode", () => ({
  isKeyCode: jest.fn(),
}));
jest.mock("./isKeystroke", () => ({
  isKeystroke: jest.fn(),
}));

const commandDummy = Symbol("test-command");

describe("isKeyboard", () => {
  let result: boolean;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    result = undefined;
  })

  describe("when the command is a key code command", () => {
    beforeEach(() => {
      mockType(isKeyCode).mockReturnValue(true);

      result = isKeyboard(commandDummy);
    });

    it("should check if the command is a key code command", () => {
      expect(isKeyCode).toHaveBeenCalledWith(commandDummy);
    });

    it("should return true", () => {
      expect(result).toBe(true);
    });
  });

  describe("when the command is a keystroke command", () => {
    beforeEach(() => {
      mockType(isKeyCode).mockReturnValue(false);
      mockType(isKeystroke).mockReturnValue(true);

      result = isKeyboard(commandDummy);
    });

    it("should check if the command is a key code command", () => {
      expect(isKeyCode).toHaveBeenCalledWith(commandDummy);
    });

    it("should check if the command is a keystroke command", () => {
      expect(isKeystroke).toHaveBeenCalledWith(commandDummy);
    });

    it("should return true", () => {
      expect(result).toBe(true);
    });
  });

  describe("when the command is not a keyboard command", () => {
    beforeEach(() => {
      mockType(isKeyCode).mockReturnValue(false);
      mockType(isKeystroke).mockReturnValue(false);

      result = isKeyboard(commandDummy);
    });

    it("should check if the command is a key code command", () => {
      expect(isKeyCode).toHaveBeenCalledWith(commandDummy);
    });

    it("should check if the command is a keystroke command", () => {
      expect(isKeystroke).toHaveBeenCalledWith(commandDummy);
    });

    it("should return false", () => {
      expect(result).toBe(false);
    });
  });
});
