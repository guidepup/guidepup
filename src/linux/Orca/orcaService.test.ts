import {
  isOrcaServiceActive,
  startOrcaService,
  stopOrcaService,
} from "./orcaService";
import { execFileSync } from "node:child_process";

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
}));

describe("orcaService", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("isOrcaServiceActive", () => {
    it.each`
      state             | expected
      ${"active"}       | ${true}
      ${"activating"}   | ${true}
      ${"reloading"}    | ${true}
      ${"deactivating"} | ${true}
      ${"inactive"}     | ${false}
      ${"failed"}       | ${false}
    `(
      "should return $expected when the unit is $state",
      ({ state, expected }) => {
        jest.mocked(execFileSync).mockReturnValue(`${state}\n`);

        expect(isOrcaServiceActive()).toBe(expected);
        expect(execFileSync).toHaveBeenCalledWith(
          "systemctl",
          [
            "--user",
            "show",
            "orca.service",
            "--property=ActiveState",
            "--value",
          ],
          expect.anything(),
        );
      },
    );

    it("should return false when there is no service manager to ask", () => {
      jest.mocked(execFileSync).mockImplementation(() => {
        throw new Error("test-error");
      });

      expect(isOrcaServiceActive()).toBe(false);
    });
  });

  describe("stopOrcaService", () => {
    it("should stop the unit", () => {
      stopOrcaService();

      expect(execFileSync).toHaveBeenCalledWith("systemctl", [
        "--user",
        "stop",
        "orca.service",
      ]);
    });
  });

  describe("startOrcaService", () => {
    it("should start the unit, without waiting indefinitely", () => {
      startOrcaService();

      expect(execFileSync).toHaveBeenCalledWith(
        "systemctl",
        ["--user", "start", "orca.service"],
        { timeout: 10_000 },
      );
    });
  });
});
