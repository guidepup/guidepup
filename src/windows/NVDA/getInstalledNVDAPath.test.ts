import { DEFAULT_TIMEOUT } from "../../constants";
import { existsSync } from "node:fs";
import { getInstalledNVDAPath } from "./getInstalledNVDAPath";
import { spawnSync } from "child_process";
import { SUB_KEY_NVDA_APP_PATH } from "./constants";

type SpawnSyncResult = ReturnType<typeof spawnSync>;

jest.mock("node:fs", () => ({
  existsSync: jest.fn(),
}));
jest.mock("child_process", () => ({
  spawnSync: jest.fn(),
}));

const mockInstalledPath = "C:\\Program Files\\NVDA\\nvda.exe";
const mockRegOutput = `\r\nHKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\nvda.exe\r\n    (Default)    REG_SZ    ${mockInstalledPath}\r\n\r\n`;
const mockRegNotFound = { stdout: "", status: 1 } as SpawnSyncResult;
const mockRegFound = { stdout: mockRegOutput, status: 0 } as SpawnSyncResult;

describe("getInstalledNVDAPath", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(existsSync).mockReturnValue(true);
  });

  describe("when the 64-bit registry view has the path", () => {
    let result: string | null;

    beforeEach(() => {
      jest.mocked(spawnSync).mockReturnValue(mockRegFound);

      result = getInstalledNVDAPath();
    });

    it("should query the default value of the App Paths key without a shell", () => {
      expect(spawnSync).toHaveBeenCalledWith(
        "reg",
        ["query", SUB_KEY_NVDA_APP_PATH, "/ve", "/reg:64"],
        { encoding: "utf8", timeout: DEFAULT_TIMEOUT },
      );
    });

    it("should not query the 32-bit registry view", () => {
      expect(spawnSync).toHaveBeenCalledTimes(1);
    });

    it("should check that the path exists", () => {
      expect(existsSync).toHaveBeenCalledWith(mockInstalledPath);
    });

    it("should return the path", () => {
      expect(result).toBe(mockInstalledPath);
    });
  });

  describe("when only the 32-bit registry view has the path", () => {
    let result: string | null;

    beforeEach(() => {
      jest
        .mocked(spawnSync)
        .mockReturnValueOnce(mockRegNotFound)
        .mockReturnValueOnce(mockRegFound);

      result = getInstalledNVDAPath();
    });

    it("should query the 32-bit registry view", () => {
      expect(spawnSync).toHaveBeenLastCalledWith(
        "reg",
        ["query", SUB_KEY_NVDA_APP_PATH, "/ve", "/reg:32"],
        { encoding: "utf8", timeout: DEFAULT_TIMEOUT },
      );
    });

    it("should return the path", () => {
      expect(result).toBe(mockInstalledPath);
    });
  });

  describe("when neither registry view has the key", () => {
    it("should return null", () => {
      jest.mocked(spawnSync).mockReturnValue(mockRegNotFound);

      expect(getInstalledNVDAPath()).toBeNull();
    });
  });

  describe("when reg cannot be run", () => {
    it("should return null", () => {
      jest.mocked(spawnSync).mockReturnValue({
        stdout: null,
        error: new Error("test-error"),
      } as unknown as SpawnSyncResult);

      expect(getInstalledNVDAPath()).toBeNull();
    });
  });

  describe("when the path in the registry does not exist", () => {
    it("should return null", () => {
      jest.mocked(spawnSync).mockReturnValue(mockRegFound);
      jest.mocked(existsSync).mockReturnValue(false);

      expect(getInstalledNVDAPath()).toBeNull();
    });
  });
});
