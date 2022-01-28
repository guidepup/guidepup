import { mockType } from "../../../test/mockType";
import { activate } from "../activate";
import { KeyCodes } from "../KeyCodes";
import { sendKeys } from "./sendKeys";
import { isKeyCode } from "../../isKeyCode";
import { keyCode } from "../keyCode";
import { keystroke } from "./keystroke";
import { ERR_PREFIX_SEND_KEYS } from "../errors";

jest.mock("../activate", () => ({
  activate: jest.fn(),
}));
jest.mock("../keyCode", () => ({
  keyCode: jest.fn(),
}));
jest.mock("./keystroke", () => ({
  keystroke: jest.fn(),
}));
jest.mock("../../isKeyCode", () => ({
  isKeyCode: jest.fn(),
}));

const applicationName = "test-application";

describe("sendKeys", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const commonAssertions = (keyCommand) => {
    it("should activate the application", () => {
      expect(activate).toHaveBeenCalledWith(applicationName);
    });

    it("should check if the command is a key code command", () => {
      expect(isKeyCode).toHaveBeenCalledWith(keyCommand);
    });
  };

  const commonKeyCodeCommandAssertions = (keyCommand, options) => {
    it("should execute the key code command", () => {
      expect(keyCode).toHaveBeenCalledWith(keyCommand, options);
    });
  };

  const commonKeystrokeCommandAssertions = (keyCommand, options) => {
    it("should execute the keystroke command", () => {
      expect(keystroke).toHaveBeenCalledWith(keyCommand, options);
    });
  };

  describe.each`
    description            | options
    ${"not using options"} | ${undefined}
    ${"using options"}     | ${{}}
  `("when $description", ({ options }) => {
    describe("when passing a key code command successfully", () => {
      const keyCommand = {
        keyCode: KeyCodes.KEY_ENTER,
      };

      beforeEach(async () => {
        mockType(isKeyCode).mockReturnValue(true);

        await sendKeys(applicationName, keyCommand, options);
      });

      commonAssertions(keyCommand);
      commonKeyCodeCommandAssertions(keyCommand, options);
    });

    describe("when passing a key code command that throws", () => {
      let error;

      const keyCommand = {
        keyCode: KeyCodes.KEY_ENTER,
      };

      const errorStub = new Error("test-error-message");

      beforeEach(async () => {
        mockType(isKeyCode).mockReturnValue(true);
        mockType(keyCode).mockRejectedValue(errorStub);

        try {
          await sendKeys(applicationName, keyCommand, options);
        } catch (e) {
          error = e;
        }
      });

      commonAssertions(keyCommand);
      commonKeyCodeCommandAssertions(keyCommand, options);

      it("should throw a wrapped error", () => {
        expect(error).toEqual(
          new Error(
            `${ERR_PREFIX_SEND_KEYS}${applicationName}\n${errorStub.message}`
          )
        );
      });
    });

    describe("when passing a keystroke command successfully", () => {
      const keyCommand = {
        characters: "test-characters",
      };

      beforeEach(async () => {
        mockType(isKeyCode).mockReturnValue(false);

        await sendKeys(applicationName, keyCommand, options);
      });

      commonAssertions(keyCommand);
      commonKeystrokeCommandAssertions(keyCommand, options);
    });

    describe("when passing a key code command that throws", () => {
      let error;

      const keyCommand = {
        characters: "test-characters",
      };

      const errorStub = new Error("test-error-message");

      beforeEach(async () => {
        mockType(isKeyCode).mockReturnValue(false);
        mockType(keystroke).mockRejectedValue(errorStub);

        try {
          await sendKeys(applicationName, keyCommand, options);
        } catch (e) {
          error = e;
        }
      });

      commonAssertions(keyCommand);
      commonKeystrokeCommandAssertions(keyCommand, options);

      it("should throw a wrapped error", () => {
        expect(error).toEqual(
          new Error(
            `${ERR_PREFIX_SEND_KEYS}${applicationName}\n${errorStub.message}`
          )
        );
      });
    });
  });
});
