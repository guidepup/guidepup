import { activate } from "./activate";
import { DEFAULT_RETRY_COUNT } from "../constants";
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

    jest.mocked(withTransaction).mockReturnValue(stubTransactionBlock);
  });

  describe.each`
    description                   | options              | expectedRetryOptions
    ${"without options"}          | ${undefined}         | ${{ retries: DEFAULT_RETRY_COUNT }}
    ${"with options"}             | ${{}}                | ${{ retries: DEFAULT_RETRY_COUNT }}
    ${"with a timeout"}           | ${{ timeout: 1000 }} | ${{ timeout: 1000, retries: DEFAULT_RETRY_COUNT }}
    ${"with an explicit retries"} | ${{ retries: 5 }}    | ${{ retries: 5 }}
  `("when called $description", ({ options, expectedRetryOptions }) => {
    beforeEach(async () => {
      await activate(applicationName, options);
    });

    it("should wrap the activate command with a transaction block", () => {
      expect(withTransaction).toHaveBeenCalledWith("activate");
    });

    it("should pass the activate script delegate to a runner that retries if an apple event timeout is thrown, defaulting to the standard retry count", () => {
      expect(retryIfAppleEventTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        expectedRetryOptions,
      );
    });

    describe("when the retry runner invokes the delegate", () => {
      beforeEach(() => {
        const delegate = jest.mocked(retryIfAppleEventTimeout).mock.calls[0][0];

        delegate();
      });

      it("should construct an activate script executor", () => {
        expect(runAppleScript).toHaveBeenCalledWith(
          `tell application "${applicationName}"\n${stubTransactionBlock}\nend tell`,
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

    it("should throw an error with the activate prefix, application name, and underlying error message", async () => {
      await expect(() => activate(applicationName)).rejects.toEqual(
        new Error(`Unable to activate application: ${applicationName}`, {
          cause: stubError,
        }),
      );
    });
  });
});
