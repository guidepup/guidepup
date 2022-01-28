import { move } from "./move";
import { mockType } from "../../../test/mockType";
import { withTransaction } from "../withTransaction";
import { retryIfAppleEventTimeout } from "../retryIfAppleEventTimeout";
import { runAppleScript } from "../runAppleScript";
import { Directions } from "./Directions";
import { Containments } from "./Containments";
import { Places } from "./Places";
import { Applications } from "../Applications";
import { ERR_VOICE_OVER_MOVE } from "../errors";

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

describe("move", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockType(withTransaction).mockReturnValue(stubTransactionBlock);
  });

  describe.each`
    description                                          | direction                    | place                | options      | expectedCommandSuffix
    ${"with move down, without options"}                 | ${Directions.DOWN}           | ${undefined}         | ${undefined} | ${"down"}
    ${"with move left, with options"}                    | ${Directions.LEFT}           | ${undefined}         | ${{}}        | ${"left"}
    ${"with move right to the desktop, without options"} | ${Directions.RIGHT}          | ${Places.DESKTOP}    | ${undefined} | ${"right to desktop"}
    ${"with move up to the dock, with options"}          | ${Directions.UP}             | ${Places.DOCK}       | ${{}}        | ${"up to dock"}
    ${"with move in to the first item, without options"} | ${Containments.INTERACT_IN}  | ${Places.FIRST_ITEM} | ${undefined} | ${"into item to first item"}
    ${"with move out to the last item, with options"}    | ${Containments.INTERACT_OUT} | ${Places.LAST_ITEM}  | ${{}}        | ${"out of item to last item"}
  `(
    "when called $description",
    ({ direction, place, options, expectedCommandSuffix }) => {
      beforeEach(async () => {
        await move(direction, place, options);
      });

      it("should wrap the move command with a transaction block", () => {
        expect(withTransaction).toHaveBeenCalledWith(
          `tell vo cursor to move ${expectedCommandSuffix}`
        );
      });

      it("should pass the move script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
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

        it("should construct a move script executor", () => {
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

    it("should throw an error with the move prefix, application name, and underlying error message", async () => {
      await expect(() => move(Directions.DOWN)).rejects.toEqual(
        new Error(`${ERR_VOICE_OVER_MOVE}\n${stubError.message}`)
      );
    });
  });
});
