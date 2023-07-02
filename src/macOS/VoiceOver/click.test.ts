import { Applications } from "../Applications";
import { click } from "./click";
import { ERR_VOICE_OVER_CLICK } from "../errors";
import { retryIfAppleEventTimeout } from "../retryIfAppleEventTimeout";
import { runAppleScript } from "../runAppleScript";
import { withTransaction } from "../withTransaction";

jest.mock("../retryIfAppleEventTimeout", () => ({
  retryIfAppleEventTimeout: jest.fn(),
}));
jest.mock("../runAppleScript", () => ({
  runAppleScript: jest.fn(),
}));
jest.mock("../withTransaction", () => ({
  withTransaction: jest.fn(),
}));

const stubTransactionBlock = "test-transaction-block";

describe("click", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(withTransaction).mockReturnValue(stubTransactionBlock);
  });

  describe.each`
    description                                       | clickOptions                                                    | expectedCommandSuffix
    ${"without options"}                              | ${undefined}                                                    | ${"once with left button"}
    ${"with empty options"}                           | ${{}}                                                           | ${"once with left button"}
    ${"with click left"}                              | ${{ button: "left" }}                                           | ${"once with left button"}
    ${"with click right"}                             | ${{ button: "right" }}                                          | ${"once with right button"}
    ${"with click once"}                              | ${{ clickCount: 1 }}                                            | ${"once with left button"}
    ${"with click twice"}                             | ${{ clickCount: 2 }}                                            | ${"twice with left button"}
    ${"with click thrice"}                            | ${{ clickCount: 3 }}                                            | ${"thrice with left button"}
    ${"with click left once"}                         | ${{ button: "left", clickCount: 1 }}                            | ${"once with left button"}
    ${"with click left once"}                         | ${{ button: "left", clickCount: 2 }}                            | ${"twice with left button"}
    ${"with click left once"}                         | ${{ button: "left", clickCount: 3 }}                            | ${"thrice with left button"}
    ${"with click right once"}                        | ${{ button: "right", clickCount: 1 }}                           | ${"once with right button"}
    ${"with click right once"}                        | ${{ button: "right", clickCount: 2 }}                           | ${"twice with right button"}
    ${"with click right once"}                        | ${{ button: "right", clickCount: 3 }}                           | ${"thrice with right button"}
    ${"with click left once with additional options"} | ${{ button: "left", clickCount: 1, retries: 1, timeout: 1000 }} | ${"once with left button"}
  `("when called $description", ({ clickOptions, expectedCommandSuffix }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { clickCount, button, ...options } = clickOptions ?? {};

    beforeEach(async () => {
      await click(clickOptions);
    });

    it("should wrap the click command with a transaction block", () => {
      expect(withTransaction).toHaveBeenCalledWith(
        `tell mouse cursor to click ${expectedCommandSuffix}`
      );
    });

    it("should pass the click script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
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

      it("should construct a click script executor", () => {
        expect(runAppleScript).toHaveBeenCalledWith(
          `tell application "${Applications.VoiceOver}"\n${stubTransactionBlock}\nend tell`,
          options
        );
      });
    });
  });

  describe("when the script execution throws", () => {
    const stubError = new Error("test-error-message");

    beforeEach(() => {
      jest.mocked(retryIfAppleEventTimeout).mockRejectedValue(stubError);
    });

    it("should throw an error with the click prefix, application name, and underlying error message", async () => {
      await expect(() => click()).rejects.toEqual(
        new Error(`${ERR_VOICE_OVER_CLICK}\n${stubError.message}`)
      );
    });
  });
});
