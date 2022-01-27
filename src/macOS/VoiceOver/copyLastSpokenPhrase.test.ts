import { copyLastSpokenPhrase } from "./copyLastSpokenPhrase";
import { mockType } from "../../../test/mockType";
import { withTransaction } from "../withTransaction";
import { retry } from "../../retry";
import { runAppleScript } from "../runAppleScript";
import { Applications } from "../Applications";
import { ERR_VOICE_OVER_COPY_LAST_SPOKEN_PHRASE } from "../errors";

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

describe("copyLastSpokenPhrase", () => {
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
      await copyLastSpokenPhrase(options);
    });

    it("should wrap the copyLastSpokenPhrase command with a transaction block", () => {
      expect(withTransaction).toHaveBeenCalledWith(
        "tell last phrase to copy to pasteboard"
      );
    });

    it("should pass the copyLastSpokenPhrase script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
      expect(retry).toHaveBeenCalledWith(
        expect.any(Function),
        options
      );
    });

    describe("when the retry runner invokes the delegate", () => {
      beforeEach(() => {
        const delegate = mockType(retry).mock.calls[0][0];

        delegate();
      });

      it("should construct a copyLastSpokenPhrase script executor", () => {
        expect(runAppleScript).toHaveBeenCalledWith(
          `tell application "${Applications.VOICE_OVER}"\n${stubTransactionBlock}\nend tell`,
          options
        );
      });
    });
  });

  describe("when the script execution throws", () => {
    const stubError = new Error("test-error-message");

    beforeEach(() => {
      mockType(retry).mockRejectedValue(stubError);
    });

    it("should throw an error with the copyLastSpokenPhrase prefix, application name, and underlying error message", async () => {
      await expect(() => copyLastSpokenPhrase()).rejects.toEqual(
        new Error(
          `${ERR_VOICE_OVER_COPY_LAST_SPOKEN_PHRASE}\n${stubError.message}`
        )
      );
    });
  });
});
