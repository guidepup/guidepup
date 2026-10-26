import { DEFAULT_TIMEOUT } from "../../constants";
import { existsSync } from "node:fs";
import { getUserNVDAInstallationPath } from "./getUserNVDAInstallationPath";
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

describe("getUserNVDAInstallationPath", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(existsSync).mockReturnValue(true);
  });

  describe("when the 64-bit registry view has the path", () => {
    let result: string | null;

    beforeEach(() => {
      jest.mocked(spawnSync).mockReturnValue(mockRegFound);

      result = getUserNVDAInstallationPath();
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

      result = getUserNVDAInstallationPath();
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

      expect(getUserNVDAInstallationPath()).toBeNull();
    });
  });

  describe("when reg cannot be run", () => {
    it("should return null", () => {
      jest.mocked(spawnSync).mockReturnValue({
        stdout: null,
        error: new Error("test-error"),
      } as unknown as SpawnSyncResult);

      expect(getUserNVDAInstallationPath()).toBeNull();
    });

    it("should query both registry views", () => {
      jest.mocked(spawnSync).mockReturnValue({
        stdout: null,
        error: new Error("test-error"),
      } as unknown as SpawnSyncResult);

      getUserNVDAInstallationPath();

      expect(spawnSync).toHaveBeenCalledTimes(2);
    });
  });

  describe("when reg reports an error with output", () => {
    it("should ignore the output", () => {
      jest.mocked(spawnSync).mockReturnValue({
        ...mockRegFound,
        error: new Error("test-timeout"),
      } as SpawnSyncResult);

      expect(getUserNVDAInstallationPath()).toBeNull();
      expect(existsSync).not.toHaveBeenCalled();
    });
  });

  describe("when reg exits with a non-zero status with output", () => {
    it("should ignore the output", () => {
      jest
        .mocked(spawnSync)
        .mockReturnValue({ ...mockRegFound, status: 1 } as SpawnSyncResult);

      expect(getUserNVDAInstallationPath()).toBeNull();
      expect(existsSync).not.toHaveBeenCalled();
    });
  });

  describe("when the 64-bit query fails and the 32-bit view has the path", () => {
    it("should return the path", () => {
      jest
        .mocked(spawnSync)
        .mockReturnValueOnce({
          stdout: null,
          error: new Error("test-error"),
        } as unknown as SpawnSyncResult)
        .mockReturnValueOnce(mockRegFound);

      expect(getUserNVDAInstallationPath()).toBe(mockInstalledPath);
    });
  });

  describe("when the path in the registry does not exist", () => {
    it("should return null", () => {
      jest.mocked(spawnSync).mockReturnValue(mockRegFound);
      jest.mocked(existsSync).mockReturnValue(false);

      expect(getUserNVDAInstallationPath()).toBeNull();
    });
  });
});
