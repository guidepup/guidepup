import { mockType } from "../../test/mockType";
import { record } from "./record";
import { spawn } from "child_process";

jest.mock("child_process", () => ({
  spawn: jest.fn(),
}));

const mockFilepath = "test-filepath";

describe("record", () => {
  let abortFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    abortFunction = record(mockFilepath);
  });

  it("should spawn a screencapture child process for recording", () => {
    expect(spawn).toHaveBeenCalledWith(
      "/usr/sbin/screencapture",
      ["-v", "-C", "-k", "-T0", "-g", mockFilepath],
      {
        signal: expect.any(AbortSignal),
      }
    );
  });

  it("should return an abort function to stop the screencapture process", () => {
    const abortSignal = mockType(spawn).mock.calls[0][2].signal;
    const mockReason = "test-reason";

    expect(abortSignal.aborted).toBeFalsy();

    abortFunction(mockReason);

    expect(abortSignal.aborted).toBeTruthy();
  });
});
