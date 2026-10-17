import { execFileSync } from "node:child_process";
import { isAtSpiRunning } from "./isAtSpiRunning";

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
}));

describe("isAtSpiRunning", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when an AT-SPI bus launcher process is found", () => {
    beforeEach(() => {
      jest.mocked(execFileSync).mockReturnValue(Buffer.from("1234\n"));
    });

    it("should return true", () => {
      expect(isAtSpiRunning()).toBe(true);
    });

    it("should match the launcher by its full command line", () => {
      isAtSpiRunning();

      expect(execFileSync).toHaveBeenCalledWith("pgrep", [
        "-f",
        "(^|/)at-spi-bus-launcher(\\s|$)",
      ]);
    });
  });

  describe("when no AT-SPI bus launcher process is found", () => {
    beforeEach(() => {
      jest.mocked(execFileSync).mockImplementation(() => {
        throw new Error("test-error");
      });
    });

    it("should return false", () => {
      expect(isAtSpiRunning()).toBe(false);
    });
  });
});
