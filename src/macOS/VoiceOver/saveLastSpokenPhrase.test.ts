import { Applications } from "../Applications";
import { ERR_VOICE_OVER_SAVE_LAST_SPOKEN_PHRASE } from "../errors";
import { mockType } from "../../../test/mockType";
import { retry } from "../../retry";
import { runAppleScript } from "../runAppleScript";
import { saveLastSpokenPhrase } from "./saveLastSpokenPhrase";
import { waitForSaved } from "./waitForSaved";
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
jest.mock("./waitForSaved", () => ({
  waitForSaved: jest.fn(),
}));

const stubTransactionBlock = "test-transaction-block";

describe("saveLastSpokenPhrase", () => {
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
      await saveLastSpokenPhrase(options);
    });

    it("should wrap the saveLastSpokenPhrase command with a transaction block", () => {
      expect(withTransaction).toHaveBeenCalledWith("tell last phrase to save");
    });

    it("should pass the saveLastSpokenPhrase script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
      expect(retry).toHaveBeenCalledWith(expect.any(Function), options);
    });

    describe("when the retry runner invokes the delegate", () => {
      beforeEach(() => {
        const delegate = mockType(retry).mock.calls[0][0];

        delegate();
      });

      it("should construct a saveLastSpokenPhrase script executor", () => {
        expect(runAppleScript).toHaveBeenCalledWith(
          `tell application "${Applications.VoiceOver}"\n${stubTransactionBlock}\nend tell`,
          options
        );
      });
    });

    it("should wait for the phrase to have been saved", () => {
      expect(waitForSaved).toHaveBeenCalledWith(options);
    })
  });

  describe("when the script execution throws", () => {
    const stubError = new Error("test-error-message");

    beforeEach(() => {
      mockType(retry).mockRejectedValue(stubError);
    });

    it("should throw an error with the saveLastSpokenPhrase prefix, application name, and underlying error message", async () => {
      await expect(() => saveLastSpokenPhrase()).rejects.toEqual(
        new Error(
          `${ERR_VOICE_OVER_SAVE_LAST_SPOKEN_PHRASE}\n${stubError.message}`
        )
      );
    });
  });
});
