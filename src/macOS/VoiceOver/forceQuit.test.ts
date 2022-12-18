import { ChildProcess, exec } from "child_process";
import { forceQuit } from "./forceQuit";
import { mockType } from "../../../test/mockType";

jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

describe("forceQuit", () => {
  beforeEach(async () => {
    mockType(exec).mockImplementation((_command, callback) => {
      callback();

      return {} as unknown as ChildProcess;
    });

    await forceQuit();
  });

  it("should attempt to terminate (kill -15) the VoiceOver process (SIGTERM over SIGKILL owing to the process being run by launchd)", () => {
    expect(exec).toHaveBeenCalledWith(
      `kill -15 $(ps aux | egrep "[V]oiceOver" | awk '{print $2}')`,
      expect.any(Function)
    );
  });
});
