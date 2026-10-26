import { DEFAULT_RETRY_COUNT } from "../constants";
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

const runningScript = `return application "${applicationName}" is running`;
const quitScript = `tell application "${applicationName}"\n${stubTransactionBlock}\nend tell`;

describe("quit", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(withTransaction).mockReturnValue(stubTransactionBlock);
    jest
      .mocked(retryIfAppleEventTimeout)
      .mockImplementation(async (delegate) => await delegate());
    jest
      .mocked(runAppleScript)
      .mockImplementation(async (script) =>
        script === runningScript ? "true" : undefined,
      );
  });

  describe.each`
    description          | options
    ${"without options"} | ${undefined}
    ${"with options"}    | ${{}}
  `("when called $description", ({ options }) => {
    beforeEach(async () => {
      await quit(applicationName, options);
    });

    it("should check whether the application is running", () => {
      expect(runAppleScript).toHaveBeenCalledWith(runningScript, options);
    });

    it("should retry the running check on AppleEvent timeout, as it only reads state", () => {
      expect(retryIfAppleEventTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        { retries: DEFAULT_RETRY_COUNT, ...options },
      );
    });

    it("should wrap the quit command with a transaction block", () => {
      expect(withTransaction).toHaveBeenCalledWith("quit");
    });

    it("should pass the quit script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
      expect(retryIfAppleEventTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        options,
      );
    });

    it("should run the quit script", () => {
      expect(runAppleScript).toHaveBeenCalledWith(quitScript, options);
    });
  });

  describe("when the application is not running", () => {
    beforeEach(async () => {
      jest.mocked(runAppleScript).mockResolvedValue("false");

      await quit(applicationName);
    });

    it("should not run the quit script", () => {
      expect(runAppleScript).not.toHaveBeenCalledWith(quitScript, undefined);
    });
  });

  describe("when checking whether the application is running throws", () => {
    const stubError = new Error("test-error-message");

    beforeEach(() => {
      jest.mocked(runAppleScript).mockRejectedValue(stubError);
    });

    it("should throw an error with the quit prefix, application name, and underlying error", async () => {
      await expect(() => quit(applicationName)).rejects.toThrow(
        new Error(`Unable to quit application: ${applicationName}`, {
          cause: stubError,
        }),
      );
    });
  });

  describe("when the script execution throws", () => {
    const stubError = new Error("test-error-message");

    beforeEach(() => {
      jest
        .mocked(runAppleScript)
        .mockImplementation(async (script) =>
          script === runningScript ? "true" : Promise.reject(stubError),
        );
    });

    it("should throw an error with the quit prefix, application name, and underlying error message", async () => {
      await expect(() => quit(applicationName)).rejects.toThrow(
        new Error(`Unable to quit application: ${applicationName}`, {
          cause: stubError,
        }),
      );
    });
  });
});
