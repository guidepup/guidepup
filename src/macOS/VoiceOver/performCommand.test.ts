import { performCommand } from "./performCommand";
import { mockType } from "../../../test/mockType";
import { withTransaction } from "../withTransaction";
import { retryIfAppleEventTimeout } from "../retryIfAppleEventTimeout";
import { runAppleScript } from "../runAppleScript";
import { Applications } from "../Applications";
import { ERR_VOICE_OVER_PERFORM_COMMAND } from "../errors";
import { CommanderCommands } from "./CommanderCommands";

jest.mock("../retryIfAppleEventTimeout", () => ({
  retryIfAppleEventTimeout: jest.fn(),
}));
jest.mock("../runAppleScript", () => ({
  runAppleScript: jest.fn(),
}));
jest.mock("../withTransaction", () => ({
  withTransaction: jest.fn(),
}));

const command = CommanderCommands.ACTIONS;

const stubTransactionBlock = "test-transaction-block";

describe("performCommand", () => {
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
      await performCommand(command, options);
    });

    it("should wrap the performCommand command with a transaction block", () => {
      expect(withTransaction).toHaveBeenCalledWith(
        `tell commander to perform command "${command}"`
      );
    });

    it("should pass the performCommand script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
      expect(retryIfAppleEventTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        options
      );
    });

    describe("when the retryIfAppleEventTimeout runner invokes the delegate", () => {
      beforeEach(() => {
        const delegate = mockType(retryIfAppleEventTimeout).mock.calls[0][0];

        delegate();
      });

      it("should construct a performCommand script executor", () => {
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
      mockType(retryIfAppleEventTimeout).mockRejectedValue(stubError);
    });

    it("should throw an error with the performCommand prefix, application name, and underlying error message", async () => {
      await expect(() => performCommand(command)).rejects.toEqual(
        new Error(`${ERR_VOICE_OVER_PERFORM_COMMAND}\n${stubError.message}`)
      );
    });
  });
});
