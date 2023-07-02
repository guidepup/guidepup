import { keystroke } from "./keystroke";
import { retryIfAppleEventTimeout } from "../retryIfAppleEventTimeout";
import { runAppleScript } from "../runAppleScript";
import { withModifiers } from "../withModifiers";

jest.mock("../retryIfAppleEventTimeout", () => ({
  retryIfAppleEventTimeout: jest.fn(),
}));
jest.mock("../runAppleScript", () => ({
  runAppleScript: jest.fn(),
}));
jest.mock("../withModifiers", () => ({
  withModifiers: jest.fn(),
}));

const mockScriptWithModifiers = "test-script-with-modifiers";

describe("keystroke", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(withModifiers).mockReturnValue(mockScriptWithModifiers);
  });

  describe.each`
    description                                | command                                                            | options
    ${"without modifiers and without options"} | ${{ characters: "test-characters" }}                               | ${undefined}
    ${"without modifiers and with options"}    | ${{ characters: "test-characters" }}                               | ${{}}
    ${"with modifiers and without options"}    | ${{ characters: "test-characters", modifiers: ["test-modifier"] }} | ${undefined}
    ${"with modifiers and with options"}       | ${{ characters: "test-characters", modifiers: ["test-modifier"] }} | ${{}}
  `("when called $description", ({ command, options }) => {
    beforeEach(async () => {
      await keystroke(command, options);
    });

    it("should augment the command with modifiers", () => {
      expect(withModifiers).toHaveBeenCalledWith(
        command.modifiers ?? [],
        `keystroke "${command.characters}"`
      );
    });

    it("should pass the keystroke script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
      expect(retryIfAppleEventTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        options
      );
    });

    describe("when the retry runner invokes the delegate", () => {
      beforeEach(() => {
        const delegate = jest.mocked(retryIfAppleEventTimeout).mock.calls[0][0];

        delegate();
      });

      it("should construct a keystroke script executor", () => {
        expect(runAppleScript).toHaveBeenCalledWith(
          `tell application "System Events"\n${mockScriptWithModifiers}\nend tell`,
          options
        );
      });
    });
  });
});
