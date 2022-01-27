import { keystroke } from "./keystroke";
import { mockType } from "../../../test/mockType";
import { retryIfAppleEventTimeout } from "../retryIfAppleEventTimeout";
import { runAppleScript } from "../runAppleScript";

jest.mock("../retryIfAppleEventTimeout", () => ({
  retryIfAppleEventTimeout: jest.fn(),
}));
jest.mock("../runAppleScript", () => ({
  runAppleScript: jest.fn(),
}));

describe("keystroke", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each`
    description                                | command                                                            | options      | expectedScript
    ${"without modifiers and without options"} | ${{ characters: "test-characters" }}                               | ${undefined} | ${'keystroke "test-characters"'}
    ${"without modifiers and with options"}    | ${{ characters: "test-characters" }}                               | ${{}}        | ${'keystroke "test-characters"'}
    ${"with modifiers and without options"}    | ${{ characters: "test-characters", modifiers: ["test-modifier"] }} | ${undefined} | ${'keystroke "test-characters" using {test-modifier}'}
    ${"with modifiers and with options"}       | ${{ characters: "test-characters", modifiers: ["test-modifier"] }} | ${{}}        | ${'keystroke "test-characters" using {test-modifier}'}
  `("when called $description", ({ command, options, expectedScript }) => {
    beforeEach(async () => {
      await keystroke(command, options);
    });

    it("should pass the keystroke script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
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

      it("should construct a keystroke script executor", () => {
        expect(runAppleScript).toHaveBeenCalledWith(
          `tell application "System Events"\n${expectedScript}\nend tell`,
          options
        );
      });
    });
  });
});
