import { activate } from "../activate";
import { ERR_PREFIX_SEND_KEYS } from "../errors";
import { isKeyCode } from "../../isKeyCode";
import { keyCode } from "../keyCode";
import { KeyCodes } from "../KeyCodes";
import { keystroke } from "./keystroke";
import { mockType } from "../../../test/mockType";
import { sendKeys } from "./sendKeys";

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

describe("sendKeys", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const commonAssertions = (keyCommand, applicationName) => {
    if (applicationName) {
      it("should activate the application", () => {
        expect(activate).toHaveBeenCalledWith(applicationName);
      });
    } else {
      it("should not activate any applications", () => {
        expect(activate).not.toHaveBeenCalled();
      });
    }

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
    description                                            | applicationName            | options      | expectedErrorPrefix
    ${"no application name nor options"}                   | ${undefined}               | ${undefined} | ${ERR_PREFIX_SEND_KEYS}
    ${"no application name and using options"}             | ${undefined}               | ${{}}        | ${ERR_PREFIX_SEND_KEYS}
    ${"provide an application name but not using options"} | ${"test-application-name"} | ${undefined} | ${`${ERR_PREFIX_SEND_KEYS}to application: test-application-name`}
    ${"provide an application name  and using options"}    | ${"test-application-name"} | ${{}}        | ${`${ERR_PREFIX_SEND_KEYS}to application: test-application-name`}
  `(
    "when $description",
    ({ applicationName, options, expectedErrorPrefix }) => {
      describe("when passing a key code command successfully", () => {
        const keyCommand = {
          keyCode: KeyCodes.Enter,
        };

        beforeEach(async () => {
          mockType(isKeyCode).mockReturnValue(true);

          await sendKeys(keyCommand, applicationName, options);
        });

        commonAssertions(keyCommand, applicationName);
        commonKeyCodeCommandAssertions(keyCommand, options);
      });

      describe("when passing a key code command that throws", () => {
        let error;

        const keyCommand = {
          keyCode: KeyCodes.Enter,
        };

        const errorStub = new Error("test-error-message");

        beforeEach(async () => {
          mockType(isKeyCode).mockReturnValue(true);
          mockType(keyCode).mockRejectedValue(errorStub);

          try {
            await sendKeys(keyCommand, applicationName, options);
          } catch (e) {
            error = e;
          }
        });

        commonAssertions(keyCommand, applicationName);
        commonKeyCodeCommandAssertions(keyCommand, options);

        it("should throw a wrapped error", () => {
          expect(error).toEqual(
            new Error(`${expectedErrorPrefix}\n${errorStub.message}`)
          );
        });
      });

      describe("when passing a keystroke command successfully", () => {
        const keyCommand = {
          characters: "test-characters",
        };

        beforeEach(async () => {
          mockType(isKeyCode).mockReturnValue(false);

          await sendKeys(keyCommand, applicationName, options);
        });

        commonAssertions(keyCommand, applicationName);
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
            await sendKeys(keyCommand, applicationName, options);
          } catch (e) {
            error = e;
          }
        });

        commonAssertions(keyCommand, applicationName);
        commonKeystrokeCommandAssertions(keyCommand, options);

        it("should throw a wrapped error", () => {
          expect(error).toEqual(
            new Error(`${expectedErrorPrefix}\n${errorStub.message}`)
          );
        });
      });
    }
  );
});
