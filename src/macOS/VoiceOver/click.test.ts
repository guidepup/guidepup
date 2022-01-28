import { click } from "./click";
import { mockType } from "../../../test/mockType";
import { withTransaction } from "../withTransaction";
import { retryIfAppleEventTimeout } from "../retryIfAppleEventTimeout";
import { runAppleScript } from "../runAppleScript";
import { ClickCount } from "./ClickCount";
import { ClickButton } from "./ClickButton";
import { Applications } from "../Applications";
import { ERR_VOICE_OVER_CLICK } from "../errors";

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

    mockType(withTransaction).mockReturnValue(stubTransactionBlock);
  });

  describe.each`
    description                                  | clickCount          | clickButton                 | options      | expectedCommandSuffix
    ${"with click once, without options"}        | ${ClickCount.ONCE}  | ${undefined}                | ${undefined} | ${"once"}
    ${"with click once, with options"}           | ${ClickCount.ONCE}  | ${undefined}                | ${{}}        | ${"once"}
    ${"with click left once, without options"}   | ${ClickCount.ONCE}  | ${ClickButton.LEFT_BUTTON}  | ${undefined} | ${"once with left button"}
    ${"with click left once, with options"}      | ${ClickCount.ONCE}  | ${ClickButton.LEFT_BUTTON}  | ${{}}        | ${"once with left button"}
    ${"with click right twice, without options"} | ${ClickCount.TWICE} | ${ClickButton.RIGHT_BUTTON} | ${undefined} | ${"twice with right button"}
    ${"with click right twice, with options"}    | ${ClickCount.TWICE} | ${ClickButton.RIGHT_BUTTON} | ${{}}        | ${"twice with right button"}
  `(
    "when called $description",
    ({ clickCount, clickButton, options, expectedCommandSuffix }) => {
      beforeEach(async () => {
        await click(clickCount, clickButton, options);
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
          const delegate = mockType(retryIfAppleEventTimeout).mock.calls[0][0];

          delegate();
        });

        it("should construct a click script executor", () => {
          expect(runAppleScript).toHaveBeenCalledWith(
            `tell application "${Applications.VOICE_OVER}"\n${stubTransactionBlock}\nend tell`,
            options
          );
        });
      });
    }
  );

  describe("when the script execution throws", () => {
    const stubError = new Error("test-error-message");

    beforeEach(() => {
      mockType(retryIfAppleEventTimeout).mockRejectedValue(stubError);
    });

    it("should throw an error with the click prefix, application name, and underlying error message", async () => {
      await expect(() => click(ClickCount.ONCE)).rejects.toEqual(
        new Error(`${ERR_VOICE_OVER_CLICK}\n${stubError.message}`)
      );
    });
  });
});
