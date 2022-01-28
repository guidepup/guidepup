import { mockType } from "../../../test/mockType";
import { waitForCondition } from "../../waitForCondition";
import { ERR_VOICE_OVER_RUNNING_TIMEOUT } from "../errors";
import { isRunning } from "./isRunning";
import { waitForRunning } from "./waitForRunning";

jest.mock("../../waitForCondition", () => ({
  waitForCondition: jest.fn(),
}));
jest.mock("./isRunning", () => ({
  isRunning: jest.fn(),
}));

describe("waitForRunning", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each`
    description          | options
    ${"without options"} | ${undefined}
    ${"with options"}    | ${{}}
  `("when called $description", ({ options }) => {
    beforeEach(async () => {
      await waitForRunning(options);
    });

    it("should set up a condition wrapper with a custom timeout error message", () => {
      expect(waitForCondition).toHaveBeenCalledWith(expect.any(Function), {
        timeoutErrorMessage: ERR_VOICE_OVER_RUNNING_TIMEOUT,
      });
    });

    describe("when the condition delegate is executed", () => {
      beforeEach(async () => {
        await mockType(waitForCondition).mock.calls[0][0]();
      });

      it("should check whether VoiceOver is running", () => {
        expect(isRunning).toHaveBeenCalledWith(options);
      });
    });
  });
});
