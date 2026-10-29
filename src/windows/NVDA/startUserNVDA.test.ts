import { ERR_NVDA_CANNOT_BE_STARTED, ERR_NVDA_RUNNING_TIMEOUT } from "../errors";
import { DEFAULT_RUNNING_TIMEOUT } from "../../constants";
import { isAnyNVDARunning } from "./isAnyNVDARunning";
import { runVbsScript } from "../runVbsScript";
import { startUserNVDA } from "./startUserNVDA";
import { waitForCondition } from "../../waitForCondition";

jest.mock("../runVbsScript", () => ({
  runVbsScript: jest.fn(),
}));
jest.mock("./isAnyNVDARunning", () => ({
  isAnyNVDARunning: jest.fn(),
}));
jest.mock("../../waitForCondition", () => ({
  waitForCondition: jest.fn(),
}));

const mockInstalledPath = "C:\\Program Files\\NVDA\\nvda.exe";
const mockError = new Error("test-error");

describe("startUserNVDA", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(runVbsScript).mockResolvedValue(undefined);
    jest.mocked(waitForCondition).mockResolvedValue();
  });

  describe("when NVDA starts", () => {
    beforeEach(async () => {
      await startUserNVDA(mockInstalledPath);
    });

    it("should start NVDA through the Windows shell, with the path quoted", () => {
      expect(runVbsScript).toHaveBeenCalledWith(
        `set WshShell = CreateObject("WScript.Shell")\nWshShell.Run """${mockInstalledPath}""",1,False\nset WshShell = Nothing`,
      );
    });

    it("should wait until an NVDA is running", async () => {
      expect(waitForCondition).toHaveBeenCalledWith(expect.any(Function), {
        pollTimeout: DEFAULT_RUNNING_TIMEOUT,
        timeoutErrorMessage: ERR_NVDA_RUNNING_TIMEOUT,
      });

      const [condition] = jest.mocked(waitForCondition).mock.calls[0];

      jest.mocked(isAnyNVDARunning).mockResolvedValue(true);

      await expect(condition()).resolves.toBe(true);
      expect(isAnyNVDARunning).toHaveBeenCalled();
    });
  });

  describe("when the path contains a double quote", () => {
    it("should escape it for VBScript", async () => {
      await startUserNVDA('C:\\a"b\\nvda.exe');

      expect(runVbsScript).toHaveBeenCalledWith(
        expect.stringContaining('WshShell.Run """C:\\a""b\\nvda.exe""",1,False'),
      );
    });
  });

  describe("when the script fails", () => {
    it("should throw a cannot be started error with the cause", async () => {
      jest.mocked(runVbsScript).mockRejectedValue(mockError);

      const error = await startUserNVDA(mockInstalledPath).catch((e) => e);

      expect(error).toEqual(new Error(ERR_NVDA_CANNOT_BE_STARTED));
      expect(error.cause).toBe(mockError);
      expect(waitForCondition).not.toHaveBeenCalled();
    });
  });

  describe("when NVDA does not start in time", () => {
    it("should throw a cannot be started error with the cause", async () => {
      jest.mocked(waitForCondition).mockRejectedValue(mockError);

      const error = await startUserNVDA(mockInstalledPath).catch((e) => e);

      expect(error).toEqual(new Error(ERR_NVDA_CANNOT_BE_STARTED));
      expect(error.cause).toBe(mockError);
    });
  });
});
