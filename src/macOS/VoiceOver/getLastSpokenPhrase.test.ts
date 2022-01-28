import { getLastSpokenPhrase } from "./getLastSpokenPhrase";
import { mockType } from "../../../test/mockType";
import { withTransaction } from "../withTransaction";
import { retry } from "../../retry";
import { runAppleScript } from "../runAppleScript";
import { Applications } from "../Applications";
import { ERR_VOICE_OVER_GET_LAST_SPOKEN_PHRASE } from "../errors";

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

describe("getLastSpokenPhrase", () => {
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
      await getLastSpokenPhrase(options);
    });

    it("should wrap the getLastSpokenPhrase command with a transaction block", () => {
      expect(withTransaction).toHaveBeenCalledWith(
        "return content of last phrase"
      );
    });

    it("should pass the getLastSpokenPhrase script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
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

      it("should construct a getLastSpokenPhrase script executor", () => {
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

    it("should throw an error with the getLastSpokenPhrase prefix, application name, and underlying error message", async () => {
      await expect(() => getLastSpokenPhrase()).rejects.toEqual(
        new Error(
          `${ERR_VOICE_OVER_GET_LAST_SPOKEN_PHRASE}\n${stubError.message}`
        )
      );
    });
  });
});
