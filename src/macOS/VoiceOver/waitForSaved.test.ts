import { waitForSaved } from "./waitForSaved";
import { waitForCondition } from "../../waitForCondition";
import { mockType } from "../../../test/mockType";
import { ERR_VOICE_OVER_SAVED_TIMEOUT } from "../errors";
import { isSaved } from "./isSaved";

jest.mock("../../waitForCondition", () => ({
  waitForCondition: jest.fn(),
}));
jest.mock("./isSaved", () => ({
  isSaved: jest.fn(),
}));

describe("waitForSaved", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each`
    description          | options
    ${"without options"} | ${undefined}
    ${"with options"}    | ${{}}
  `("when called $description", ({ options }) => {
    beforeEach(async () => {
      await waitForSaved(options);
    });

    it("should set up a condition wrapper with a custom timeout error message", () => {
      expect(waitForCondition).toHaveBeenCalledWith(expect.any(Function), {
        timeoutErrorMessage: ERR_VOICE_OVER_SAVED_TIMEOUT,
        pollInterval: 1000,
        pollTimeout: 20000,
      });
    });

    describe("when the condition delegate is executed", () => {
      beforeEach(async () => {
        await mockType(waitForCondition).mock.calls[0][0]();
      });

      it("should check whether VoiceOver is running", () => {
        expect(isSaved).toHaveBeenCalledWith(options);
      });
    });
  });
});
