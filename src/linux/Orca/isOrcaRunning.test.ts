import { execFileSync } from "node:child_process";
import { isOrcaRunning } from "./isOrcaRunning";

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
}));
jest.mock("node:os", () => ({
  ...jest.requireActual("node:os"),
  userInfo: () => ({ uid: 1234 }),
}));

describe("isOrcaRunning", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true when this user has an Orca process", () => {
    jest.mocked(execFileSync).mockReturnValue(Buffer.from("1234\n"));

    expect(isOrcaRunning()).toBe(true);
    expect(execFileSync).toHaveBeenCalledWith("pgrep", [
      "-u",
      "1234",
      "-x",
      "orca",
    ]);
  });

  it("should return false when this user has no Orca process", () => {
    jest.mocked(execFileSync).mockImplementation(() => {
      throw new Error("test-error");
    });

    expect(isOrcaRunning()).toBe(false);
  });
});
