import { getItemText } from "./getItemText";
import { mockType } from "../../../test/mockType";
import { withTransaction } from "../withTransaction";
import { retry } from "../../retry";
import { runAppleScript } from "../runAppleScript";
import { Applications } from "../Applications";
import { ERR_VOICE_OVER_GET_ITEM_TEXT } from "../errors";

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

describe("getItemText", () => {
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
      await getItemText(options);
    });

    it("should wrap the getItemText command with a transaction block", () => {
      expect(withTransaction).toHaveBeenCalledWith(
        "return text under cursor of vo cursor"
      );
    });

    it("should pass the getItemText script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
      expect(retry).toHaveBeenCalledWith(expect.any(Function), options);
    });

    describe("when the retry runner invokes the delegate", () => {
      beforeEach(() => {
        const delegate = mockType(retry).mock.calls[0][0];

        delegate();
      });

      it("should construct a getItemText script executor", () => {
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

    it("should throw an error with the getItemText prefix, application name, and underlying error message", async () => {
      await expect(() => getItemText()).rejects.toEqual(
        new Error(`${ERR_VOICE_OVER_GET_ITEM_TEXT}\n${stubError.message}`)
      );
    });
  });
});
