import { activate } from "./activate";
import { mockType } from "../../test/mockType";
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

describe("activate", () => {
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
      await activate(applicationName, options);
    });

    it("should wrap the activate command with a transaction block", () => {
      expect(withTransaction).toHaveBeenCalledWith("activate");
    });

    it("should pass the activate script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
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

      it("should construct a activate script executor", () => {
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
      mockType(retryIfAppleEventTimeout).mockRejectedValue(stubError);
    });

    it("should throw an error with the activate prefix, application name, and underlying error message", async () => {
      await expect(() => activate(applicationName)).rejects.toEqual(
        new Error(
          `Unable to activate application: ${applicationName}\n${stubError.message}`
        )
      );
    });
  });
});
