import { ChildProcess, exec } from "child_process";
import { keyCodeCommands } from "./keyCodeCommands";
import { MacOSApplications } from "..";
import { quit } from "../quit";
import { sendKeys } from "../sendKeys";
import { terminateVoiceOverProcess } from "./terminateVoiceOverProcess";

jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

jest.mock("../quit", () => ({
  quit: jest.fn(),
}));

jest.mock("../sendKeys", () => ({
  sendKeys: jest.fn(),
}));

const optionsDummy = {};

describe("terminateVoiceOverProcess", () => {
  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (exec as any).mockImplementation((_command, callback) => {
      callback();

      return {} as unknown as ChildProcess;
    });

    await terminateVoiceOverProcess(optionsDummy);
  });

  it("should attempt to a quit key code command to the VoiceOver application", () => {
    expect(sendKeys).toHaveBeenCalledWith(
      keyCodeCommands.quit,
      MacOSApplications.VoiceOver,
      optionsDummy,
    );
  });

  it("should attempt an AppleScript based quit of the VoiceOver application", () => {
    expect(quit).toHaveBeenCalledWith(
      MacOSApplications.VoiceOver,
      optionsDummy,
    );
  });

  it("should attempt to terminate (kill -15) the VoiceOver process (SIGTERM over SIGKILL owing to the process being run by launchd)", () => {
    expect(exec).toHaveBeenCalledWith(
      `kill -15 $(ps aux | egrep "[V]oiceOver.app/Contents/MacOS/VoiceOver launchd -s" | awk '{print $2}')`,
      expect.any(Function),
    );
  });
});
