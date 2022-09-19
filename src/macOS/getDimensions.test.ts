import { Applications } from "./Applications";
import { getDimensions } from "./getDimensions";
import { mockType } from "../../test/mockType";
import { retryIfAppleEventTimeout } from "./retryIfAppleEventTimeout";
import { runAppleScript } from "./runAppleScript";

jest.mock("./retryIfAppleEventTimeout", () => ({
  retryIfAppleEventTimeout: jest.fn(),
}));
jest.mock("./runAppleScript", () => ({
  runAppleScript: jest.fn(),
}));
jest.mock("./withTransaction", () => ({
  withTransaction: jest.fn(),
}));

const mockAppleScriptResult = Symbol("test-apple-script-result");

describe("getDimensions", () => {
  let result;

  beforeEach(() => {
    jest.clearAllMocks();

    mockType(retryIfAppleEventTimeout).mockResolvedValue(mockAppleScriptResult);
  });

  describe.each`
    description          | options
    ${"without options"} | ${undefined}
    ${"with options"}    | ${{}}
  `("when called $description", ({ options }) => {
    beforeEach(async () => {
      result = await getDimensions(options);
    });

    it("should pass the getDimensions script delegate and options to an runner that retries if an apple event timeout is thrown", () => {
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

      it("should construct a getDimensions script executor", () => {
        expect(runAppleScript).toHaveBeenCalledWith(
          `tell application "${Applications.Finder}" to get bounds of window of desktop`,
          options
        );
      });
    });

    it("should return the result", () => {
      expect(result).toBe(mockAppleScriptResult);
    });
  });

  describe("when the script execution throws", () => {
    beforeEach(async () => {
      mockType(retryIfAppleEventTimeout).mockRejectedValue(
        new Error("test-error-message")
      );

      result = await getDimensions();
    });

    it("should return an empty string", async () => {
      expect(result).toBe("");
    });
  });
});
