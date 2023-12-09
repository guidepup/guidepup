import { ChildProcess, exec } from "child_process";
import { terminateVoiceOverProcess } from "./terminateVoiceOverProcess";

jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

describe("terminateVoiceOverProcess", () => {
  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (exec as any).mockImplementation((_command, callback) => {
      callback();

      return {} as unknown as ChildProcess;
    });

    await terminateVoiceOverProcess();
  });

  it("should attempt to terminate (kill -15) the VoiceOver process (SIGTERM over SIGKILL owing to the process being run by launchd)", () => {
    expect(exec).toHaveBeenCalledWith(
      `kill -15 $(ps aux | egrep "[V]oiceOver.app/Contents/MacOS/VoiceOver launchd -s" | awk '{print $2}')`,
      expect.any(Function)
    );
  });
});
