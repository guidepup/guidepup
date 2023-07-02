import { Applications } from "../Applications";
import { ERR_VOICE_OVER_TAKE_SCREENSHOT } from "../errors";
import { retry } from "../../retry";
import { runAppleScript } from "../runAppleScript";
import { takeScreenshot } from "./takeScreenshot";
import { withTransaction } from "../withTransaction";

jest.mock("../../retry", () => ({
  retry: jest.fn(),
}));
jest.mock("../runAppleScript", () => ({
  runAppleScript: jest.fn(),
}));
jest.mock("../withTransaction", () => ({
  withTransaction: jest.fn(),
}));

const stubTransactionBlock = "test-transaction-block";

describe("takeScreenshot", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(withTransaction).mockReturnValue(stubTransactionBlock);
  });

  describe.each`
    description          | options
    ${"without options"} | ${undefined}
    ${"with options"}    | ${{}}
  `("when called $description", ({ options }) => {
    beforeEach(async () => {
      await takeScreenshot(options);
    });

    it("should wrap the takeScreenshot command with a transaction block", () => {
      expect(withTransaction).toHaveBeenCalledWith(
        "tell vo cursor to grab screenshot"
      );
    });

    it("should pass the takeScreenshot script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
      expect(retry).toHaveBeenCalledWith(expect.any(Function), options);
    });

    describe("when the retry runner invokes the delegate", () => {
      beforeEach(() => {
        const delegate = jest.mocked(retry).mock.calls[0][0];

        delegate();
      });

      it("should construct a takeScreenshot script executor", () => {
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
      jest.mocked(retry).mockRejectedValue(stubError);
    });

    it("should throw an error with the takeScreenshot prefix, application name, and underlying error message", async () => {
      await expect(() => takeScreenshot()).rejects.toEqual(
        new Error(`${ERR_VOICE_OVER_TAKE_SCREENSHOT}\n${stubError.message}`)
      );
    });
  });
});
