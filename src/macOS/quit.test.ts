import { quit } from "./quit";
import { retryIfAppleEventTimeout } from "./retryIfAppleEventTimeout";
import { runAppleScript } from "./runAppleScript";
import { withTransaction } from "./withTransaction";

jest.mock("./retryIfAppleEventTimeout", () => ({
  retryIfAppleEventTimeout: jest.fn(),
}));
jest.mock("./runAppleScript", () => ({
  runAppleScript: jest.fn(),
}));
jest.mock("./withTransaction", () => ({
  withTransaction: jest.fn(),
}));

const applicationName = "test-application-name";

const stubTransactionBlock = "test-transaction-block";

describe("quit", () => {
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
      await quit(applicationName, options);
    });

    it("should wrap the quit command with a transaction block", () => {
      expect(withTransaction).toHaveBeenCalledWith("quit");
    });

    it("should pass the quit script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
      expect(retryIfAppleEventTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        options
      );
    });

    describe("when the retry runner invokes the delegate", () => {
      beforeEach(() => {
        const delegate = jest.mocked(retryIfAppleEventTimeout).mock.calls[0][0];

        delegate();
      });

      it("should construct a quit script executor", () => {
        expect(runAppleScript).toHaveBeenCalledWith(
          `tell application "${applicationName}"\n${stubTransactionBlock}\nend tell`,
          options
        );
      });
    });
  });

  describe("when the script execution throws", () => {
    const stubError = new Error("test-error-message");

    beforeEach(() => {
      jest.mocked(retryIfAppleEventTimeout).mockRejectedValue(stubError);
    });

    it("should throw an error with the quit prefix, application name, and underlying error message", async () => {
      await expect(() => quit(applicationName)).rejects.toEqual(
        new Error(
          `Unable to quit application: ${applicationName}\n${stubError.message}`
        )
      );
    });
  });
});
