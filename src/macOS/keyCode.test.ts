import { keyCode } from "./keyCode";
import { mockType } from "../../test/mockType";
import { retryIfAppleEventTimeout } from "./retryIfAppleEventTimeout";
import { runAppleScript } from "./runAppleScript";

jest.mock("./retryIfAppleEventTimeout", () => ({
  retryIfAppleEventTimeout: jest.fn(),
}));
jest.mock("./runAppleScript", () => ({
  runAppleScript: jest.fn(),
}));

describe("keyCode", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each`
    description                                                            | command                                                       | options      | expectedScript
    ${"without modifiers and without options"}                             | ${{ keyCode: 123456 }}                                        | ${undefined} | ${"key code 123456"}
    ${"without modifiers and with options"}                                | ${{ keyCode: 123456 }}                                        | ${{}}        | ${"key code 123456"}
    ${"with an array of key codes, without modifiers and without options"} | ${{ keyCode: [123456, 98765] }}                               | ${undefined} | ${"key code {123456, 98765}"}
    ${"with an array of key codes, without modifiers and with options"}    | ${{ keyCode: [123456, 98765] }}                               | ${{}}        | ${"key code {123456, 98765}"}
    ${"with modifiers and without options"}                                | ${{ keyCode: 123456, modifiers: ["test-modifier"] }}          | ${undefined} | ${"key code 123456 using {test-modifier}"}
    ${"with modifiers and with options"}                                   | ${{ keyCode: 123456, modifiers: ["test-modifier"] }}          | ${{}}        | ${"key code 123456 using {test-modifier}"}
    ${"with an array of key codes, with modifiers and without options"}    | ${{ keyCode: [123456, 98765], modifiers: ["test-modifier"] }} | ${undefined} | ${"key code {123456, 98765} using {test-modifier}"}
    ${"with an array of key codes, with modifiers and with options"}       | ${{ keyCode: [123456, 98765], modifiers: ["test-modifier"] }} | ${{}}        | ${"key code {123456, 98765} using {test-modifier}"}
  `("when called $description", ({ command, options, expectedScript }) => {
    beforeEach(async () => {
      await keyCode(command, options);
    });

    it("should pass the keyCode script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
      expect(retryIfAppleEventTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        options
      );
    });

    describe("when the retry runner invokes the delegate", () => {
      beforeEach(() => {
        const delegate = mockType(retryIfAppleEventTimeout).mock.calls[0][0];

        delegate();
      });

      it("should construct a keyCode script executor", () => {
        expect(runAppleScript).toHaveBeenCalledWith(
          `tell application "System Events"\n${expectedScript}\nend tell`,
          options
        );
      });
    });
  });
});
