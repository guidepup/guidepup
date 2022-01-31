import { Applications } from "../Applications";
import { ERR_VOICE_OVER_GET_ITEM_TEXT } from "../errors";
import { itemText } from "./itemText";
import { mockType } from "../../../test/mockType";
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

describe("itemText", () => {
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
      await itemText(options);
    });

    it("should wrap the itemText command with a transaction block", () => {
      expect(withTransaction).toHaveBeenCalledWith(
        "return text under cursor of vo cursor"
      );
    });

    it("should pass the itemText script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
      expect(retry).toHaveBeenCalledWith(expect.any(Function), options);
    });

    describe("when the retry runner invokes the delegate", () => {
      beforeEach(() => {
        const delegate = mockType(retry).mock.calls[0][0];

        delegate();
      });

      it("should construct a itemText script executor", () => {
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
      mockType(retry).mockRejectedValue(stubError);
    });

    it("should throw an error with the itemText prefix, application name, and underlying error message", async () => {
      await expect(() => itemText()).rejects.toEqual(
        new Error(`${ERR_VOICE_OVER_GET_ITEM_TEXT}\n${stubError.message}`)
      );
    });
  });
});
