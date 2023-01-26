import { activate } from "./activate";
import { mockType } from "../../test/mockType";
import { runVbsScript } from "./runVbsScript";

jest.mock("./runVbsScript", () => ({
  runVbsScript: jest.fn(),
}));

const mockApplicationPath = "test\\application\\path";
const mockApplicationWindowTitle = "test-application-window-title";

describe("activate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should run a vbs script to activate the application using the application path (escaped) and application window title", async () => {
    await activate(mockApplicationPath, mockApplicationWindowTitle);

    expect(runVbsScript).toHaveBeenCalledWith(
      expect.stringContaining(mockApplicationPath.replaceAll("\\", "\\\\"))
    );
    expect(runVbsScript).toHaveBeenCalledWith(
      expect.stringContaining(
        mockApplicationWindowTitle
      )
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
        await activate(mockApplicationPath, mockApplicationWindowTitle);
      } catch (e) {
        error = e;
      }
      expect(error).toEqual(
        new Error(`Unable to activate application\n${mockError.message}`)
      );
    });
  });
});
