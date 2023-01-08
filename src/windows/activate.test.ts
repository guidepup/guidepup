import { activate } from "./activate";
import { mockType } from "../../test/mockType";
import { runVbsScript } from "./runVbsScript";

jest.mock("./runVbsScript", () => ({
  runVbsScript: jest.fn(),
}));

const mockApplication = "test-application";

describe("activate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should run a vbs script to activate the application", async () => {
    await activate(mockApplication);

    expect(runVbsScript).toHaveBeenCalledWith(
      `set WshShell = CreateObject("WScript.Shell")\nWshShell.Run """${mockApplication}"" -p1 -c"\nset WshShell = Nothing`
    );
  });

  describe("when running the vbs script throws an error", () => {
    const mockError = new Error("test-error");

    beforeEach(() => {
      mockType(runVbsScript).mockRejectedValue(mockError);
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
