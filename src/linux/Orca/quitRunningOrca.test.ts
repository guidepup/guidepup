import { killRunningOrca, quitRunningOrca } from "./quitRunningOrca";
import { ERR_ORCA_FAILED_TO_QUIT_RUNNING_ORCA } from "../errors";
import { execFileSync } from "node:child_process";
import { isOrcaRunning } from "./isOrcaRunning";

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
}));
jest.mock("node:os", () => ({
  ...jest.requireActual("node:os"),
  userInfo: () => ({ uid: 1234 }),
}));
jest.mock("./isOrcaRunning", () => ({
  isOrcaRunning: jest.fn(),
}));

const pkillSignals = () =>
  jest
    .mocked(execFileSync)
    .mock.calls.filter(([command]) => command === "pkill")
    .map(([, args]) => args[0]);

const pkillArgs = (signal: string) => [
  `--signal=${signal}`,
  "-u",
  "1234",
  "-x",
  "orca",
];

describe("quitRunningOrca", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("when Orca exits after SIGTERM", () => {
    it("should resolve without sending SIGKILL, only once it has gone", async () => {
      jest
        .mocked(isOrcaRunning)
        .mockReturnValueOnce(true)
        .mockReturnValue(false);

      let resolved = false;

      const quit = quitRunningOrca().then(() => {
        resolved = true;
      });

      await jest.advanceTimersByTimeAsync(0);

      expect(resolved).toBe(false);

      await jest.advanceTimersByTimeAsync(100);
      await quit;

      expect(execFileSync).toHaveBeenCalledWith("pkill", pkillArgs("SIGTERM"));
      expect(pkillSignals()).toEqual(["--signal=SIGTERM"]);
    });
  });

  describe("when Orca has already gone by the time it is signalled", () => {
    it("should still resolve", async () => {
      jest.mocked(isOrcaRunning).mockReturnValue(false);
      jest.mocked(execFileSync).mockImplementation(() => {
        throw new Error("test-no-process-matched");
      });

      await expect(quitRunningOrca()).resolves.toBeUndefined();
    });
  });

  describe("when Orca ignores SIGTERM", () => {
    it("should send SIGKILL and wait for it to exit", async () => {
      let killed = false;

      jest.mocked(isOrcaRunning).mockImplementation(() => !killed);
      jest.mocked(execFileSync).mockImplementation((_command, args) => {
        killed = args[0] === "--signal=SIGKILL";

        return Buffer.from("");
      });

      const quit = quitRunningOrca();

      await jest.advanceTimersByTimeAsync(5_000);
      await quit;

      expect(pkillSignals()).toEqual(["--signal=SIGTERM", "--signal=SIGKILL"]);
    });
  });

  describe("when Orca survives SIGKILL", () => {
    it("should reject", async () => {
      jest.mocked(isOrcaRunning).mockReturnValue(true);

      const quit = expect(quitRunningOrca()).rejects.toThrow(
        ERR_ORCA_FAILED_TO_QUIT_RUNNING_ORCA,
      );

      await jest.advanceTimersByTimeAsync(10_000);
      await quit;
    });
  });

  describe("killRunningOrca", () => {
    it("should send SIGKILL without SIGTERM and wait for Orca to exit", async () => {
      jest
        .mocked(isOrcaRunning)
        .mockReturnValueOnce(true)
        .mockReturnValue(false);

      let resolved = false;

      const kill = killRunningOrca().then(() => {
        resolved = true;
      });

      await jest.advanceTimersByTimeAsync(0);

      expect(resolved).toBe(false);

      await jest.advanceTimersByTimeAsync(100);
      await kill;

      expect(execFileSync).toHaveBeenCalledWith("pkill", pkillArgs("SIGKILL"));
      expect(pkillSignals()).toEqual(["--signal=SIGKILL"]);
    });
  });
});
