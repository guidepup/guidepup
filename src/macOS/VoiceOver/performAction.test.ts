import { Applications } from "../Applications";
import { ERR_VOICE_OVER_PERFORM_ACTION } from "../errors";
import { mockType } from "../../../test/mockType";
import { performAction } from "./performAction";
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

describe("performAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockType(withTransaction).mockReturnValue(stubTransactionBlock);
  });

  describe.each`
    description          | options
    ${"without options"} | ${undefined}
    ${"with options"}    | ${{}}
  `("when called $description", ({ options }) => {
    beforeEach(async () => {
      await performAction(options);
    });

    it("should wrap the performAction command with a transaction block", () => {
      expect(withTransaction).toHaveBeenCalledWith(
        `tell vo cursor to perform action`
      );
    });

    it("should pass the performAction script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
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

      it("should construct a performAction script executor", () => {
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
      mockType(retryIfAppleEventTimeout).mockRejectedValue(stubError);
    });

    it("should throw an error with the performAction prefix, application name, and underlying error message", async () => {
      await expect(() => performAction()).rejects.toEqual(
        new Error(`${ERR_VOICE_OVER_PERFORM_ACTION}\n${stubError.message}`)
      );
    });
  });
});
