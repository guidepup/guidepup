import { mockType } from "../../test/mockType";
import { quit } from "./quit";
import { runVbsCode } from "./runVbsCode";

jest.mock("./runVbsCode", () => ({
  runVbsCode: jest.fn(),
}));

const mockApplication = "test-application";

describe("quit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should run a vbs script to quit the application", async () => {
    await quit(mockApplication);

    expect(runVbsCode).toHaveBeenCalledWith(
      `set WshShell = CreateObject("WScript.Shell")\nWshShell.Run "taskkill /im ""${mockApplication}""",0,False\nset WshShell = Nothing`
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
        await quit(mockApplication);
      } catch (e) {
        error = e;
      }
      expect(error).toEqual(
        new Error(`Unable to quit application\n${mockError.message}`)
      );
    });
  });
});
