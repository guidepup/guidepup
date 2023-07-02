import { Applications } from "../Applications";
import { Containments } from "./Containments";
import { Directions } from "./Directions";
import { ERR_VOICE_OVER_MOVE } from "../errors";
import { move } from "./move";
import { Places } from "./Places";
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

describe("move", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(withTransaction).mockReturnValue(stubTransactionBlock);
  });

  describe.each`
    description                                          | direction                   | place               | options      | expectedCommandSuffix
    ${"with move down, without options"}                 | ${Directions.Down}          | ${undefined}        | ${undefined} | ${"down"}
    ${"with move left, with options"}                    | ${Directions.Left}          | ${undefined}        | ${{}}        | ${"left"}
    ${"with move right to the desktop, without options"} | ${Directions.Right}         | ${Places.Desktop}   | ${undefined} | ${"right to desktop"}
    ${"with move up to the dock, with options"}          | ${Directions.Up}            | ${Places.Dock}      | ${{}}        | ${"up to dock"}
    ${"with move in to the first item, without options"} | ${Containments.InteractIn}  | ${Places.FirstItem} | ${undefined} | ${"into item to first item"}
    ${"with move out to the last item, with options"}    | ${Containments.InteractOut} | ${Places.LastItem}  | ${{}}        | ${"out of item to last item"}
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
          const delegate = jest.mocked(retryIfAppleEventTimeout).mock
            .calls[0][0];

          delegate();
        });

        it("should construct a move script executor", () => {
          expect(runAppleScript).toHaveBeenCalledWith(
            `tell application "${Applications.VoiceOver}"\n${stubTransactionBlock}\nend tell`,
            options
          );
        });
      });
    }
  );

  describe("when the script execution throws", () => {
    const stubError = new Error("test-error-message");

    beforeEach(() => {
      jest.mocked(retryIfAppleEventTimeout).mockRejectedValue(stubError);
    });

    it("should throw an error with the move prefix, application name, and underlying error message", async () => {
      await expect(() => move(Directions.Down)).rejects.toEqual(
        new Error(`${ERR_VOICE_OVER_MOVE}\n${stubError.message}`)
      );
    });
  });
});
