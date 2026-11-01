import type { ChildProcess } from "node:child_process";
import { terminateAtSpi } from "./terminateAtSpi";
import { terminateProcess } from "./terminateProcess";

jest.mock("./terminateProcess", () => ({
  terminateProcess: jest.fn(),
}));

describe("terminateAtSpi", () => {
  let processKillSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    processKillSpy = jest.spyOn(process, "kill").mockReturnValue(true);
  });

  afterEach(() => {
    processKillSpy.mockRestore();
  });

  describe("when there is a launcher", () => {
    const launcher = { pid: 1234 } as ChildProcess;

    beforeEach(async () => {
      await terminateAtSpi(launcher);
    });

    it("should signal its process group", () => {
      expect(processKillSpy).toHaveBeenCalledWith(-1234, "SIGTERM");
    });

    it("should stop the launcher", () => {
      expect(terminateProcess).toHaveBeenCalledWith(launcher, "AT-SPI");
    });
  });

  describe("when the process group is already gone", () => {
    it("should still stop the launcher", async () => {
      const launcher = { pid: 1234 } as ChildProcess;

      processKillSpy.mockImplementation(() => {
        throw new Error("test-error");
      });

      await terminateAtSpi(launcher);

      expect(terminateProcess).toHaveBeenCalledWith(launcher, "AT-SPI");
    });
  });

  describe.each`
    description                  | launcher
    ${"there is no launcher"}    | ${null}
    ${"the launcher has no pid"} | ${{ pid: undefined }}
  `("when $description", ({ launcher }) => {
    it("should not signal a process group", async () => {
      await terminateAtSpi(launcher);

      expect(processKillSpy).not.toHaveBeenCalled();
      expect(terminateProcess).toHaveBeenCalledWith(launcher, "AT-SPI");
    });
  });
});
