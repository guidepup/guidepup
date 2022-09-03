import { ERR_NVDA_RUNNING_TIMEOUT } from "../errors";
import { isRunning } from "./isRunning";
import { mockType } from "../../../test/mockType";
import { waitForCondition } from "../../waitForCondition";
import { waitForRunning } from "./waitForRunning";

jest.mock("./isRunning", () => ({
  isRunning: jest.fn(),
}));
jest.mock("../../waitForCondition", () => ({
  waitForCondition: jest.fn(),
}));

describe("waitForRunning", () => {
  beforeEach(async () => {
    await waitForRunning();
  });

  it("should wait for the condition of NVDA running", () => {
    expect(waitForCondition).toHaveBeenCalledWith(expect.any(Function), {
      timeoutErrorMessage: ERR_NVDA_RUNNING_TIMEOUT,
    });

    const condition = mockType(waitForCondition).mock.calls[0][0];

    condition();

    expect(isRunning).toHaveBeenCalled();
  });
});
