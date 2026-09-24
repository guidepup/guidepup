import { activateId } from "./activateId";
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

const applicationId = "test-application-id";

const stubTransactionBlock = "test-transaction-block";

describe("activateId", () => {
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
      await activateId(applicationId, options);
    });

    it("should wrap the activateId command with a transaction block", () => {
      expect(withTransaction).toHaveBeenCalledWith("activate");
    });

    it("should pass the activateId script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
      expect(retryIfAppleEventTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        options,
      );
    });

    describe("when the retry runner invokes the delegate", () => {
      beforeEach(() => {
        const delegate = jest.mocked(retryIfAppleEventTimeout).mock.calls[0][0];

        delegate();
      });

      it("should construct an activate id script executor", () => {
        expect(runAppleScript).toHaveBeenCalledWith(
          `tell application id "${applicationId}"\n${stubTransactionBlock}\nend tell`,
          options,
        );
      });
    });
  });

  describe("when the script execution throws", () => {
    const stubError = new Error("test-error-message");

    beforeEach(() => {
      jest.mocked(retryIfAppleEventTimeout).mockRejectedValue(stubError);
    });

    it("should throw an error with the activateId prefix, application name, and underlying error message", async () => {
      await expect(() => activateId(applicationId)).rejects.toEqual(
        new Error(`Unable to activate application by ID: ${applicationId}`, {
          cause: stubError,
        }),
      );
    });
  });
});
