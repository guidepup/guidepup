import { quit } from "./quit";
import { runVbsScript } from "./runVbsScript";

jest.mock("./runVbsScript", () => ({
  runVbsScript: jest.fn(),
}));

const mockApplication = "test-application";

describe("quit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should run a vbs script to quit the application", async () => {
    await quit(mockApplication);

    expect(runVbsScript).toHaveBeenCalledWith(
      `set WshShell = CreateObject("WScript.Shell")\nWshShell.Run "taskkill /im ""${mockApplication}""",0,False\nset WshShell = Nothing`
    );
  });

  describe("when running the vbs script throws an error", () => {
    const mockError = new Error("test-error");

    beforeEach(() => {
      jest.mocked(runVbsScript).mockRejectedValue(mockError);
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
