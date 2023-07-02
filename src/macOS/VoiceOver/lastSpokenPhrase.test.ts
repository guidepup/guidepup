import { Applications } from "../Applications";
import { ERR_VOICE_OVER_GET_LAST_SPOKEN_PHRASE } from "../errors";
import { lastSpokenPhrase } from "./lastSpokenPhrase";
import { retry } from "../../retry";
import { runAppleScript } from "../runAppleScript";
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

describe("lastSpokenPhrase", () => {
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
      await lastSpokenPhrase(options);
    });

    it("should wrap the lastSpokenPhrase command with a transaction block", () => {
      expect(withTransaction).toHaveBeenCalledWith(
        "return content of last phrase"
      );
    });

    it("should pass the lastSpokenPhrase script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
      expect(retry).toHaveBeenCalledWith(expect.any(Function), options);
    });

    describe("when the retry runner invokes the delegate", () => {
      beforeEach(() => {
        const delegate = jest.mocked(retry).mock.calls[0][0];

        delegate();
      });

      it("should construct a lastSpokenPhrase script executor", () => {
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

    it("should throw an error with the lastSpokenPhrase prefix, application name, and underlying error message", async () => {
      await expect(() => lastSpokenPhrase()).rejects.toEqual(
        new Error(
          `${ERR_VOICE_OVER_GET_LAST_SPOKEN_PHRASE}\n${stubError.message}`
        )
      );
    });
  });
});
