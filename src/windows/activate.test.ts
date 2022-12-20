import { activate } from "./activate";
import { mockType } from "../../test/mockType";
import { runVbsCode } from "./runVbsCode";

jest.mock("./runVbsCode", () => ({
  runVbsCode: jest.fn(),
}));

const mockApplication = "test-application";

describe("activate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should run a vbs script to activate the application", async () => {
    await activate(mockApplication);

    expect(runVbsCode).toHaveBeenCalledWith(
      `set WshShell = CreateObject("WScript.Shell")\nWshShell.Run """${mockApplication}"" -p1 -c"\nset WshShell = Nothing`
    );
  });

  describe("when running the vbs script throws an error", () => {
    const mockError = new Error("test-error");

    beforeEach(() => {
      mockType(runVbsCode).mockRejectedValue(mockError);
    });

    it("should throw a wrapped error", async () => {
      let error;

      try {
        await activate(mockApplication);
      } catch (e) {
        error = e;
      }
      expect(error).toEqual(
        new Error(`Unable to activate application\n${mockError.message}`)
      );
    });
  });
});
